import { body } from "express-validator";

const validateRegister = [
  body("email").isEmail().withMessage("Debe ser un email válido"),
  body("contraseña")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),
  body("nombre").notEmpty().withMessage("El nombre es requerido"),
  // Añadir más validaciones según tu necesidad
];

const validateLogin = [
  body("emailOrCuit").custom((value) => {
    const isEmail = /\S+@\S+\.\S+/.test(value);
    const isCuit = /^[0-9]{11}$/.test(value);

    if (!isEmail && !isCuit) {
      throw new Error("Debe ser un email válido o un CUIT válido (11 dígitos)");
    }
    return true;
  }),
  body("contraseña").notEmpty().withMessage("La contraseña es obligatoria"),
];

export { validateRegister, validateLogin };
