import { Router } from "express";
import {
  createSubcategory,
  deleteSubcategory,
  getSubcategoryById,
  getSubcategories,
  updateSubcategory,
  toggleSubcategoryStatus,
} from "../controllers/subcategories.controllers.js";

const router = Router();

router.get("/subcategories", getSubcategories);

router.get("/subcategories/:id", getSubcategoryById);

router.post("/subcategories", createSubcategory);

router.put("/subcategories/:id", updateSubcategory);

router.delete("/subcategories/:id", deleteSubcategory);

router.put("/subcategories/:id/state", toggleSubcategoryStatus);

export default router;
