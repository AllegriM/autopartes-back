import { getConnection, queries } from "../database/index.js";

export const getCategories = async (req, res) => {
  const { estado } = req.query;
  try {
    const pool = await getConnection();
    const [rows] = await pool.query(queries.getAllCategories);

    res.status(200).json(rows);
  } catch (error) {
    next(error);
  }
};

export const getCategoriesAndSubcategories = async (req, res) => {
  const { isAdmin } = req.query;
  const query =
    isAdmin === "true"
      ? queries.getCategoriesAndSubcategories
      : queries.getActiveCategoriasAndSubcategories;
  try {
    const pool = await getConnection();
    const [rows] = await pool.query(query);
    const categorias = rows.map((categoria) => {
      // Solo parsear si subcategorias es una cadena JSON
      if (typeof categoria.subcategorias === "string") {
        try {
          categoria.subcategorias = JSON.parse(categoria.subcategorias);
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      }
      return categoria;
    });
    res.status(200).json(categorias);
  } catch (error) {
    next(error);
  }
};

export const getCategoryById = async (req, res) => {
  const { estado } = req.query;
  try {
    const { id } = req.params;
    const pool = await getConnection();

    const [rows] = await pool.query(queries.getCategoryById, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req, res) => {
  try {
    const { nombre } = req.body;
    const pool = await getConnection();
    await pool.query(queries.createCategory, [nombre]);

    res.status(201).json({ message: "Categoría creada" });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;

    const pool = await getConnection();
    const [result] = await pool.query(
      "UPDATE categories SET nombre = ? WHERE id = ?",
      [nombre, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }
    res
      .status(200)
      .json({ message: "Categoría actualizada", category: req.body });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getConnection();
    const [result] = await pool.query(queries.deleteCategory, [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }
    res.status(200).json({ message: "Categoría eliminada" });
  } catch (error) {
    next(error);
  }
};

export const toggleCategoryStatus = async (req, res) => {
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
    await pool.query(queries.toggleCategoryStatus, [nuevoEstado, id]);
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
