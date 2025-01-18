export const getUserById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const pool = await getConnection();

    const [result] = await pool.query("SELECT * FROM USUARIOS WHERE id = ?", [
      id,
    ]);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
