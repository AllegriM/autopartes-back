import { getConnection, queries } from "../database/index.js";

export const getCategories = async (req, res, next) => {
  let connection;
  try {
    connection = await getConnection();
    const [rows] = await connection.query(queries.getAllCategories);

    res.status(200).json(rows);
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.releaseConnection();
  }
};

export const getCategoriesAndSubcategories = async (req, res, next) => {
  const { isAdmin } = req.query;
  const query =
    isAdmin === "true"
      ? queries.getCategoriesAndSubcategories
      : queries.getActiveCategoriasAndSubcategories;
  let connection;
  try {
    connection = await getConnection();
    const [rows] = await connection.query(query);
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
  } finally {
    if (connection) connection.releaseConnection();
  }
};

export const getCategoryById = async (req, res, next) => {
  const { estado } = req.query;
  let connection;
  try {
    const { id } = req.params;
    connection = await getConnection();

    const [rows] = await connection.query(queries.getCategoryById, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.releaseConnection();
  }
};

export const createCategory = async (req, res, next) => {
  let connection;
  try {
    const { nombre } = req.body;
    connection = await getConnection();
    await connection.query(queries.createCategory, [nombre]);

    res.status(201).json({ message: "Categoría creada" });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.releaseConnection();
  }
};

export const updateCategory = async (req, res, next) => {
  let connection;
  try {
    const { id } = req.params;
    const { nombre } = req.body;

    connection = await getConnection();
    const [result] = await connection.query(queries.updateCategory, [
      nombre,
      id,
    ]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }
    res
      .status(200)
      .json({ message: "Categoría actualizada", category: req.body });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.releaseConnection();
  }
};

export const deleteCategory = async (req, res, next) => {
  let connection;
  try {
    const { id } = req.params;
    connection = await getConnection();
    const [result] = await connection.query(queries.deleteCategory, [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }
    res.status(200).json({ message: "Categoría eliminada" });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.releaseConnection();
  }
};

export const toggleCategoryStatus = async (req, res, next) => {
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
  let connection;
  try {
    // Ejecución de la consulta
    connection = await getConnection();
    await connection.query(queries.toggleCategoryStatus, [nuevoEstado, id]);
    res.status(200).json({
      message: `Categoría ${estado ? "activada" : "desactivada"} exitosamente`,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.releaseConnection();
  }
};
