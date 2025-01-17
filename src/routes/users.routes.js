import { Router } from "express";
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from "../controllers/users.controllers.js";

const router = Router();

router.get("/users", createUser);

router.get("/users/:id", getUserById);

router.post("/users", getUsers);

router.put("/users/:id", updateUser);

router.delete("/users/:id", deleteUser);

export default router;
