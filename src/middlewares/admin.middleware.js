export const verifyRole = (req, res, next) => {
  const userRole = req.user?.role;
  if (!userRole) {
    return res.status(401).json({ message: "No autorizado" });
  }

  req.isAdmin = userRole === "admin";
  next();
};
