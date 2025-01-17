import { Router } from "express";
import {
  login,
  register,
  editProfile,
  newPassword,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controllers.js";
import {
  validateLogin,
  validateRegister,
} from "../validations/auth.validations.js";
// import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/login", validateLogin, login);

router.post("/register", validateRegister, register);

router.put("/profile", editProfile);

router.put("/new-password", newPassword);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);

// router.post("/logout", authMiddleware, logout);

export default router;
