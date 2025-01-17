import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { getConnection, queries } from "../database/index.js";
import { transporter } from "../utils/emailConfig.js";

export const register = async (req, res) => {
  const {
    email,
    contraseña,
    nombre,
    apellido,
    direccion,
    cuit,
    telefono,
    localidad,
    provincia,
  } = req.body;

  // Validación de errores
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const pool = await getConnection();

    const [userExist] = await pool.query(
      "SELECT * FROM USUARIOS WHERE email = ? OR cuit = ?",
      [email, cuit]
    );

    if (userExist.length > 0) {
      return res
        .status(400)
        .json({ message: "El usuario o CUIT ya está registrado" });
    }

    // Hashear la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(contraseña, salt);

    // Insertar nuevo usuario en la base de datos
    await pool.query(
      "INSERT INTO USUARIOS (email, contraseña, nombre, apellido, direccion, cuit, telefono, localidad, provincia) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        email,
        hashedPassword,
        nombre,
        apellido,
        direccion,
        cuit,
        telefono,
        localidad,
        provincia,
      ]
    );

    // Generar un token JWT
    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({ nombre, email, token });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res) => {
  const { emailOrCuit, contraseña } = req.body;

  // Validación de errores
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const pool = await getConnection();

    // Buscar al usuario por su email o CUIT
    const [result] = await pool.query(
      "SELECT * FROM USUARIOS WHERE email = ? OR cuit = ?",
      [emailOrCuit, emailOrCuit]
    );
    const user = result[0];

    if (!user) {
      return res.status(400).json({ message: "Usuario inexistente" });
    }

    // Comparar la contraseña hasheada
    const isMatch = await bcrypt.compare(contraseña, user.contraseña);

    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Usuario o contraseña incorrectos" });
    }

    // Generar y devolver el token JWT
    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      token,
      usuario: {
        id: user.id,
        rol: user.rol,
        nombre: user.nombre,
        email: user.email,
        cuit: user.cuit,
        telefono: user.telefono,
        direccion: user.direccion,
        localidad: user.localidad,
        provincia: user.provincia,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const editProfile = async (req, res) => {
  const { id, nombre, email, telefono, direccion, localidad, provincia } =
    req.body;
  try {
    const pool = await getConnection();

    await pool.query(queries.editUser, [
      nombre,
      email,
      telefono,
      direccion,
      localidad,
      provincia,
      id,
    ]);

    const [result] = await pool.query(
      "SELECT id, nombre, email, cuit, telefono, direccion, localidad, provincia, rol FROM USUARIOS WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res
        .status(400)
        .json({ message: "No se pudo actualizar el perfil" });
    }

    res.status(200).json({ message: "Perfil actualizado", usuario: result[0] });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const newPassword = async (req, res) => {
  const { id, antiguaContraseña, nuevaContraseña } = req.body;

  try {
    const pool = await getConnection();

    const [user] = await pool.query("SELECT * FROM USUARIOS WHERE id = ?", [
      id,
    ]);

    if (user.length === 0) {
      return res.status(400).json({ message: "Usuario inexistente" });
    }

    const isMatch = await bcrypt.compare(antiguaContraseña, user[0].contraseña);

    if (!isMatch) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    // Hashear la nueva contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(nuevaContraseña, salt);

    await pool.query("UPDATE USUARIOS SET contraseña = ? WHERE id = ?", [
      hashedPassword,
      id,
    ]);

    res.status(200).json({ message: "Contraseña actualizada" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const pool = await getConnection();
    const [user] = await pool.query("SELECT * FROM USUARIOS WHERE email = ?", [
      email,
    ]);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Generar un token único
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Guardar el token en la base de datos con expiración
    await pool.query(
      "UPDATE USUARIOS SET resetToken = ?, resetTokenExpires = ? WHERE email = ?",
      [hashedToken, new Date(Date.now() + 15 * 60 * 1000), email]
    );

    // Enviar el correo con el enlace de recuperación
    const resetURL = `http://localhost:5173/reestablecer-contraseña/${resetToken}`;
    const message = `
      Has solicitado restablecer tu contraseña. 
      Haz clic en el siguiente enlace para crear una nueva contraseña:
      ${resetURL}
      Este enlace expira en 15 minutos.
    `;

    await transporter.sendMail({
      to: email,
      subject: "Recuperación de Contraseña",
      text: message,
    });

    res.status(200).json({ message: "Correo enviado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const pool = await getConnection();

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const [rows] = await pool.query(
      "SELECT * FROM USUARIOS WHERE resetToken = ? AND resetTokenExpires > ?",
      [hashedToken, new Date()]
    );

    if (rows.length === 0) {
      console.log("Token inválido o expirado");
      return res.status(400).json({ message: "Token inválido o expirado" });
    }

    const user = rows[0];

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const [result] = await pool.query(
      "UPDATE USUARIOS SET contraseña = ?, resetToken = NULL, resetTokenExpires = NULL WHERE email = ?",
      [hashedPassword, user.email]
    );

    if (result.affectedRows === 0) {
      return res
        .status(400)
        .json({ message: "Error al actualizar la contraseña" });
    }

    res.status(200).json({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    console.error("Error interno:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
