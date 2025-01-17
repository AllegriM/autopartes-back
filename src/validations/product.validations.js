import { body, query } from "express-validator";

export const createProductValidator = [
  body("nombre")
    .exists()
    .withMessage("El nombre es obligatorio")
    .bail()
    .isString(),
  body("descripcion").optional().isString(),
  body("precio")
    .exists()
    .withMessage("El precio es obligatorio")
    .bail()
    .isFloat({ min: 0 }),
  body("codigo")
    .exists()
    .withMessage("El código es obligatorio")
    .bail()
    .isString(),
  body("codigo_barra")
    .exists()
    .withMessage("El código de barra es obligatorio")
    .bail()
    .isString(),
  body("marca").optional().isString(),
  body("modelo").optional().isString(),
  body("stock").optional().isInt({ min: 0 }),
  body("id_categoria")
    .exists()
    .withMessage("La categoría es obligatoria")
    .bail()
    .isInt()
    .withMessage("La categoría debe ser un número"),
];

export const updateProductValidator = [
  body("nombre")
    .exists()
    .withMessage("El nombre es obligatorio")
    .bail()
    .isString(),
  body("descripcion").optional().isString(),
  body("precio")
    .exists()
    .withMessage("El precio es obligatorio")
    .bail()
    .isFloat({ min: 0 }),
  body("codigo")
    .exists()
    .withMessage("El código es obligatorio")
    .bail()
    .isString(),
  body("codigo_barra")
    .exists()
    .withMessage("El código de barra es obligatorio")
    .bail()
    .isString(),
  body("marca").optional().isString(),
  body("modelo").optional().isString(),
  body("stock").optional().isInt({ min: 0 }),
  body("id_categoria")
    .exists()
    .withMessage("La categoría es obligatoria")
    .bail()
    .isInt()
    .withMessage("La categoría debe ser un número"),
];

export const getProductByIDValidator = [
  body("id").exists().withMessage("El ID es necesario").isNumeric(),
];

export const getProductByCategoryValidator = [
  query("categoria")
    .exists()
    .withMessage("La categoría es necesaria")
    .isNumeric()
    .withMessage("La categoría debe ser un número"),

  query("sub")
    .optional()
    .isNumeric()
    .withMessage("La subcategoría debe ser un número"),
];

export const getQueryValidator = [
  query("search").exists().withMessage("La búsqueda es necesaria").isString(),
];

export const deleteProductValidator = [
  body("id").exists().withMessage("El ID es necesario").isNumeric(),
];
