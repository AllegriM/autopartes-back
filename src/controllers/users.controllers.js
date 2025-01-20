import { getConnection } from "../database";

export const getUserById = async (req, res, next) => {
  const { id } = req.params;
  let connection;
  try {
    connection = await getConnection();

    const [result] = await connection.query(
      "SELECT * FROM USUARIOS WHERE id = ?",
      [id]
    );

    res.status(200).json(result);
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.releaseConnection();
  }
};
