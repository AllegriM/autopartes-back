import { getConnection, queries } from "../database/index.js";

export const getSubcategories = async (req, res, next) => {
  let connection;
  try {
    connection = await getConnection();
    const [result] = await connection.query(queries.getAllSubcategories);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.releaseConnection();
  }
};

export const getSubcategoryById = async (req, res, next) => {
  let connection;
  try {
    const { id } = req.params;
    connection = await getConnection();
    const [result] = await connection.query(queries.getSubcategoryById, [id]);
    if (!result.length) {
      return res.status(404).json({ message: "Subcategoría no encontrada" });
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.releaseConnection();
  }
};

export const createSubcategory = async (req, res, next) => {
  let connection;
  try {
    const { subcategory } = req.body;
    connection = await getConnection();
    await connection.query(queries.createSubcategory, [
      subcategory.nombre,
      subcategory.id_categoria,
    ]);
    res.status(201).json({ message: "Subcategoría creada" });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.releaseConnection();
  }
};

export const updateSubcategory = async (req, res, next) => {
  let connection;
  const { nombre, id_categoria } = req.body;
  try {
    const { id } = req.params;
    connection = await getConnection();
    const [result] = await connection.query(queries.updateSubcategory, [
      nombre,
      id_categoria,
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Subcategoría no encontrada" });
    }

    res.status(200).json({
      message: "Subcategoría actualizada",
      subcategory: { id, nombre, id_categoria },
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.releaseConnection();
  }
};

export const deleteSubcategory = async (req, res, next) => {
  let connection;
  try {
    const { id } = req.params;
    connection = await getConnection();
    const [result] = await connection.query(queries.deleteSubcategory, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Subcategoría no encontrada" });
    }

    res.status(200).json({ message: "Subcategoría eliminada" });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.releaseConnection();
  }
};

export const toggleSubcategoryStatus = async (req, res, next) => {
  let connection;
  const { id } = req.params;
  let { estado } = req.body;

  // Validación del campo estado
  if (typeof estado !== "boolean") {
    return res
      .status(400)
      .json({ message: "El campo estado debe ser un booleano" });
  }
  // Asignación del nuevo estado
  const nuevoEstado = estado ? "A" : "D";

  try {
    // Ejecución de la consulta
    connection = await getConnection();
    await connection.query(queries.toggleSubcategoryStatus, [nuevoEstado, id]);
    res.status(200).json({
      message: `Categoría ${estado ? "activada" : "desactivada"} exitosamente`,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.releaseConnection();
  }
};
