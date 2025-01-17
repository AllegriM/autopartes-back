import nodemailer from "nodemailer";
import CONFIG from "../config.js";

// Configurar el transporter (SMTP)
export const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: CONFIG.EMAIL_ACCOUNT,
    pass: CONFIG.EMAIL_PASSWORD,
  },
  logger: true,
  debug: true,
});

export const sendEmailNotification = async (pedido) => {
  const { precio_total, productos, usuario } = pedido;

  const productosHTML = productos
    .map(
      (p) =>
        `<li>Item: ${p.nombre}, Cantidad: ${p.cantidad}, Precio: $${p.precio}</li>`
    )
    .join("");

  const mailOptions = {
    from: `"Pedidos Autopartes" ${CONFIG.EMAIL_ACCOUNT}'`, // Nombre y correo remitente
    to: usuario.email, // Reemplaza con el correo de tu página de ventas
    subject: "Nuevo Pedido Realizado",
    html: `
        <h1>Nuevo Pedido Recibido</h1>
        <p>Detalles del Pedido:</p>
        <ul>
          ${productosHTML}
        </ul>
        <p><strong>Precio Total: $${precio_total}</strong></p>
        <p>Espero a que el vendedor lo contacte.</p>
      `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Correo enviado exitosamente");
  } catch (error) {
    console.error("Error al enviar el correo:", error);
  }
};
