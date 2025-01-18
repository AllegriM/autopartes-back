import { getConnection, queries } from "../database/index.js";

export const getSubcategories = async (req, res, next) => {
  try {
    const pool = await getConnection();
    const [result] = await pool.query(queries.getAllSubcategories);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getSubcategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const pool = await getConnection();
    const [result] = await pool.query(queries.getSubcategoryById, [id]);
    if (!result.length) {
      return res.status(404).json({ message: "Subcategoría no encontrada" });
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const createSubcategory = async (req, res, next) => {
  try {
    const { subcategory } = req.body;
    const pool = await getConnection();
    await pool.query(queries.createSubcategory, [
      subcategory.nombre,
      subcategory.id_categoria,
    ]);
    res.status(201).json({ message: "Subcategoría creada" });
  } catch (error) {
    next(error);
  }
};

export const updateSubcategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const pool = await getConnection();
    const [result] = await connection.query(queries.updateSubcategory, [
      req.body.nombre,
      req.body.id_categoria,
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
  }
};

export const deleteSubcategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const [result] = await connection.query(queries.deleteSubcategory, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Subcategoría no encontrada" });
    }

    res.status(200).json({ message: "Subcategoría eliminada" });
  } catch (error) {
    next(error);
  }
};

export const toggleSubcategoryStatus = async (req, res, next) => {
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
    const pool = await getConnection();
    await pool.query(queries.toggleSubcategoryStatus, [nuevoEstado, id]);
    res.status(200).json({
      message: `Categoría ${estado ? "activada" : "desactivada"} exitosamente`,
    });
  } catch (error) {
    console.error("Error en la consulta SQL:", error.message);
    res.status(500).json({
      message: "Error al cambiar el estado de la categoría",
      error,
    });
  }
};
