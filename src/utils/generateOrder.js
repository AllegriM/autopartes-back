import PDFDocument from "pdfkit";

export const generateOrderPDF = (data, res) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  try {
    const doc = new PDFDocument();

    // Configura el encabezado del PDF
    doc
      .fontSize(20)
      .text("JMP AUTOMOTORES", { align: "center", underline: true });
    doc.fontSize(16).text("Factura de Pedido", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`NRO. Pedido: ${data.id_pedido}`);
    doc.text(
      `Fecha: ${new Date(data.fecha_pedido).toLocaleDateString(
        "es-AR",
        options
      )}`
    );
    doc.moveDown();

    doc.text(`Cliente: ${data.usuario.nombre} ${data.usuario.apellido}`);
    doc.text(`CUIT: ${data.usuario.cuit}`);
    doc.text(`Email: ${data.usuario.email}`);
    doc.text(`Teléfono: ${data.usuario.telefono}`);
    doc.text(`Dirección: ${data.usuario.direccion}`);
    doc.text(`Localidad: ${data.usuario.localidad}`);
    doc.text(`Provincia: ${data.usuario.provincia}`);
    doc.moveDown();

    doc.text("Productos:", { underline: true });
    data.productos.forEach((producto, index) => {
      doc.text(
        `${index + 1}. ${producto.nombre} - $${producto.precio.toFixed(2)} x ${
          producto.cantidad
        } = $${producto.subtotal.toFixed(2)}`
      );
      doc.text(`   Descripción: ${producto.descripcion}`);
    });
    doc.moveDown();

    doc.text(`Total: $${data.total}`, { align: "right" });

    // Finaliza el documento (esto es importante para cerrar el flujo correctamente)
    doc.end();

    // Configura el tipo de contenido como PDF y pasa el flujo al cliente
    res.type("pdf");
    doc.pipe(res); // Aquí es donde el flujo del PDF es redirigido a la respuesta HTTP
  } catch (error) {
    console.error("Error al generar el PDF:", error);
    throw new Error("Error al generar el archivo PDF");
  }
};
