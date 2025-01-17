import { getConnection } from "../database/connection.js";
import { queries } from "../database/queries.js";
import { sendEmailNotification } from "../utils/emailConfig.js";

export const getOrders = async (req, res) => {
  try {
    const pool = await getConnection();
    const [result] = await pool.query(queries.getAllOrders);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getOrdersByUserId = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getConnection();
    const [result] = await pool.query(queries.getOrdersByUser, [id]);

    if (result.length === 0) {
      return res.status(404).json({
        message: "No se encontraron pedidos para el usuario especificado",
      });
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const createOrders = async (req, res) => {
  const { precio_total, id_usuario, productos, usuario } = req.body.pedido;
  const pool = await getConnection();
  const connection = await pool.getConnection();

  try {
    // Comenzar la transacción
    await connection.beginTransaction();

    // 1. Insertar el pedido en la tabla PEDIDOS
    const [pedidoResult] = await connection.query(
      "INSERT INTO PEDIDOS (precio_total, id_usuario) VALUES (?, ?);",
      [precio_total, id_usuario]
    );

    // Obtener el ID generado automáticamente
    const pedidoId = pedidoResult.insertId;

    // 2. Insertar productos en la tabla PRODUCTOS_PEDIDOS usando el pedidoId
    for (const producto of productos) {
      await connection.query(
        "INSERT INTO PRODUCTOS_PEDIDOS (id_pedido, id_producto, cantidad, precio) VALUES (?, ?, ?, ?)",
        [pedidoId, producto.id_producto, producto.cantidad, producto.precio]
      );
    }

    // Confirmar la transacción
    await connection.commit();

    // Enviar correo de notificación
    await sendEmailNotification({ precio_total, productos, usuario });

    res.status(201).json({ message: "Pedido creado exitosamente", pedidoId });
  } catch (error) {
    // Revertir la transacción en caso de error
    await connection.rollback();
    console.error(error);
    res.status(500).json({ message: "Error al crear el pedido", error });
  } finally {
    connection.release();
  }
};

export const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  try {
    const pool = await getConnection();
    const [result] = await pool.query(queries.updateOrderStatus, [estado, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "No se encontró el pedido" });
    }

    res
      .status(200)
      .json({ message: "Estado del pedido actualizado correctamente" });
  } catch (error) {
    next(error);
  }
};
