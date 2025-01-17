import { getConnection, queries } from "../database/index.js";
import {
  deleteImageFromCloudinary,
  uploadImagesToCloudinary,
} from "../utils/cloudinary.js";

export const getAdminProducts = async (req, res) => {
  try {
    const pool = await getConnection();

    const [result] = await pool.query(queries.getAllProductsAdmin);

    // Hacer una respuesta que si el length es 0, devuelva un array vacio para que no de error en el front
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// export const getProducts = async (req, res) => {
//   try {
//     const pool = await getConnection();
//     let [result] = [];

//     if (req.query.categoria) {
//       const query = req.query.sub
//         ? queries.getProductsBySubcategory
//         : queries.getProductsByCategory;

//       [result] = await pool.query(query, [
//         req.query.sub || req.query.categoria,
//       ]);
//     } else if (req.query.search) {
//       [result] = await pool.query(queries.getProductsBySearch, [
//         req.query.search,
//       ]);
//     } else {
//       [result] = await pool.query(queries.getAllProducts);
//     }

//     if (!result.length) {
//       return res.status(404).json({ message: "No se encontraron productos" });
//     }

//     res.status(200).json(result);
//   } catch (error) {
//     next(error);
//   }
// };

export const getProducts = async (req, res) => {
  try {
    const pool = await getConnection();
    let query = queries.getAllProductsWithImages;
    const params = [];

    // Ajusta la consulta según los parámetros recibidos
    if (req.query.categoria) {
      query = req.query.sub
        ? queries.getProductsBySubcategoryWithImages
        : queries.getProductsByCategoryWithImages;
      params.push(req.query.sub || req.query.categoria);
    } else if (req.query.search) {
      query = queries.getProductsBySearchWithImages;
      params.push(`%${req.query.search}%`);
    }

    // Ejecuta la consulta
    const [result] = await pool.query(query, params);

    // Formatear los datos
    const formattedResult = result.map((row) => {
      // Procesar el campo 'imagenes'
      const imagenes =
        typeof row.imagenes === "string"
          ? JSON.parse(row.imagenes)
          : row.imagenes;

      const formattedImages = Array.isArray(imagenes)
        ? imagenes
            .map((image) => ({
              id: image.id || null,
              url: image.url || null,
              alt: image.alt || "No tiene descripcion",
            }))
            .filter((image) => image.id && image.url) // Filtrar imágenes válidas
        : []; // Si no es un array, retornar vacío

      return {
        ...row,
        imagenes: formattedImages, // Asegurarse de que siempre sea un array
      };
    });

    // Enviar la respuesta formateada
    res.status(200).json(formattedResult);
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res) => {
  try {
    const pool = await getConnection();
    const [result] = await pool.query(queries.getProductById, [req.params.id]);

    if (!result.length) {
      return res.status(404).json({ message: "No se encontró el producto" });
    }

    res.status(200).json(result[0]);
  } catch (error) {
    next(error);
  }
};

export const getProductsByCategory = async (req, res) => {
  const api = req.query.sub
    ? queries.getProductsBySubcategory
    : queries.getProductsByCategory;
  try {
    const pool = await getConnection();

    const [result] = await pool.query(api, [
      req.query.sub || req.query.categoria,
    ]);

    if (!result.length) {
      return res.status(404).json({ message: "No se encontro el producto" });
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getProductsBySearch = async (req, res) => {
  try {
    const pool = await getConnection();
    const [result] = await pool.query(queries.getProductsBySearch, [
      req.query.search,
      req.query.search,
    ]);

    if (!result.length) {
      return res.status(404).json({ message: "No se encontro el producto" });
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res) => {
  // const errors = validationResult(req);

  // if (!errors.isEmpty()) {
  //   return res.status(400).json({ errors: errors.array() });
  // }

  const {
    nombre,
    descripcion = "No tiene descripción",
    precio,
    id_categoria,
    marca = "",
    modelo = "",
    stock = 0,
    codigo,
    codigo_barra,
  } = req.body;

  try {
    const pool = await getConnection();

    const [result] = await pool.query(queries.createProduct, [
      nombre,
      descripcion,
      precio,
      id_categoria,
      marca,
      modelo,
      stock,
      codigo,
      codigo_barra,
    ]);

    const productId = result.insertId || result[0].insertId;

    const imagesToUpload = [];

    Object.keys(req.files).forEach((field) => {
      req.files[field].forEach((file) => {
        imagesToUpload.push({
          buffer: file.buffer,
          original_filename: file.originalname,
        });
      });
    });

    if (imagesToUpload.length > 0) {
      console.log("Subiendo imágenes a Cloudinary...");

      try {
        // Subir imágenes a Cloudinary
        const uploadedImages = await uploadImagesToCloudinary(imagesToUpload);
        console.log("Imágenes subidas a Cloudinary:", uploadedImages);

        // Insertar URLs en la base de datos
        const imageInsertPromises = uploadedImages.map(
          async (uploadedImage) => {
            console.log(uploadedImage);
            await pool.query(queries.createImage, [
              productId,
              uploadedImage.url,
              uploadedImage.original_filename,
            ]);
          }
        );

        await Promise.all(imageInsertPromises);

        console.log("Imágenes guardadas en la base de datos.");
      } catch (err) {
        console.error("Error procesando imágenes:", err);
        throw new Error("Error al subir o guardar imágenes.");
      }
    } else {
      console.log("No se encontraron imágenes para subir.");
    }

    //Respondemos al cliente
    res.status(201).json({ message: "Producto creado con éxito", productId });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;

  const {
    nombre,
    descripcion,
    precio,
    id_categoria,
    id_subcategoria,
    codigo,
    codigo_barra,
    marca,
    modelo,
    stock,
  } = req.body;
  let imagenesEliminadas = req.body.imagenes_eliminar || [];
  if (!Array.isArray(imagenesEliminadas)) {
    imagenesEliminadas = JSON.parse(imagenesEliminadas);
  }
  const subcategoryId = id_subcategoria === "null" ? null : id_subcategoria;

  try {
    const pool = await getConnection();
    const [result] = await pool.query(queries.updateProduct, [
      nombre,
      descripcion,
      precio,
      id_categoria,
      subcategoryId,
      codigo,
      codigo_barra,
      marca,
      modelo,
      stock,
      id,
    ]);

    const imagesToUpload = [];

    Object.keys(req.files).forEach((field) => {
      req.files[field].forEach((file) => {
        imagesToUpload.push({
          buffer: file.buffer,
          original_filename: file.originalname,
        });
      });
    });

    if (imagenesEliminadas.length > 0) {
      console.log("Eliminando imágenes de Cloudinary...");

      try {
        const imageDeletePromises = imagenesEliminadas.map(async (imageId) => {
          const [imageResult] = await pool.query(queries.getImageById, [
            imageId,
          ]);

          if (imageResult.length === 0) {
            throw new Error("No se encontró la imagen en la base de datos.");
          }

          const image = imageResult[0];

          await pool.query(queries.deleteImage, [imageId]);

          await deleteImageFromCloudinary(image.url);

          console.log("Imagen eliminada de Cloudinary:", image.url);

          return imageId;
        });

        await Promise.all(imageDeletePromises);

        console.log("Imágenes eliminadas de la base de datos.");
      } catch (err) {
        console.error("Error eliminando imágenes:", err);
        throw new Error("Error al eliminar imágenes.");
      }
    }

    if (imagesToUpload.length > 0) {
      console.log("Subiendo imágenes a Cloudinary...");

      try {
        const uploadedImages = await uploadImagesToCloudinary(imagesToUpload);
        console.log("Imágenes subidas a Cloudinary:", uploadedImages);

        const imageInsertPromises = uploadedImages.map(
          async (uploadedImage) => {
            console.log(uploadedImage);
            await pool.query(queries.createImage, [
              id,
              uploadedImage.url,
              uploadedImage.original_filename,
            ]);
          }
        );

        await Promise.all(imageInsertPromises);

        console.log("Imágenes guardadas en la base de datos.");
      } catch (err) {
        console.error("Error procesando imágenes:", err);
        throw new Error("Error al subir o guardar imágenes.");
      }
    } else {
      console.log("No se encontraron imágenes para subir.");
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "No se encontró el producto" });
    }

    res.status(200).json({ message: "Producto actualizado correctamente" });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await getConnection();
    const [result] = await pool.query(queries.deleteProduct, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "No se encontró el producto" });
    }

    res.status(200).json({ message: "Producto borrado correctamente" });
  } catch (error) {
    next(error);
  }
};

export const modifyStatus = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  try {
    const pool = await getConnection();
    const [result] = await pool.query(queries.modifyStatus, [estado, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "No se encontró el producto" });
    }

    res.status(200).json({ message: "Estado actualizado correctamente" });
  } catch (error) {
    next(error);
  }
};
