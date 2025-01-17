import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  getAdminProducts,
  getProductsBySearch,
  updateProduct,
  modifyStatus,
} from "../controllers/products.controllers.js";
import {
  createProductValidator,
  deleteProductValidator,
  getProductByIDValidator,
  updateProductValidator,
  getQueryValidator,
} from "../validations/product.validations.js";
import multer from "multer";

const upload = multer();

const router = Router();

router.get("/productos", getProducts);

router.get("/productos/admin", getAdminProducts);

router.post("/productos/buscar", [getQueryValidator], getProductsBySearch);

router.get("/productos/:id", [getProductByIDValidator], getProductById);

router.post(
  "/productos",
  upload.fields([
    { name: "imagenes_0", maxCount: 1 },
    { name: "imagenes_1", maxCount: 1 },
    { name: "imagenes_2", maxCount: 1 },
  ]),
  createProduct
);

router.put(
  "/productos/:id",
  upload.fields([
    { name: "nuevas_imagenes_0", maxCount: 1 },
    { name: "nuevas_imagenes_1", maxCount: 1 },
    { name: "nuevas_imagenes_2", maxCount: 1 },
  ]),
  updateProduct
);

router.delete("/productos/:id", [deleteProductValidator], deleteProduct);

router.put("/productos/status/:id", [deleteProductValidator], modifyStatus);

export default router;
