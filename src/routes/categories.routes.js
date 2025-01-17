import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getCategoryById,
  getCategories,
  updateCategory,
  getCategoriesAndSubcategories,
  toggleCategoryStatus,
} from "../controllers/categories.controllers.js";

const router = Router();

router.get("/categories", getCategories);

router.get("/categories-and-subcategories", getCategoriesAndSubcategories);

router.get("/categories/:id", getCategoryById);

router.post("/categories", createCategory);

router.put("/categories/:id", updateCategory);

router.delete("/categories/:id", deleteCategory);

router.put("/categories/:id/state", toggleCategoryStatus);

export default router;
