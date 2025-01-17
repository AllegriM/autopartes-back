import { Router } from "express";
import {
  createClient,
  deleteClient,
  getClientById,
  getCategories,
  updateClient,
} from "../controllers/clients.controllers.js";

const router = Router();

router.get("/client", createClient);

router.get("/client/:id", getClientById);

router.post("/client", getCategories);

router.put("/client/:id", updateClient);

router.delete("/client/:id", deleteClient);

export default router;
