import cloudinary from "cloudinary";
import { fileTypeFromBuffer } from "file-type";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export const uploadImagesToCloudinary = async (images) => {
  const uploadPromises = images.map(async (image, index) => {
    try {
      // Determinar el tipo MIME
      const fileType = await fileTypeFromBuffer(image.buffer);
      if (!fileType) {
        throw new Error(
          `No se pudo determinar el tipo MIME para la imagen #${index + 1}`
        );
      }

      // Prefijo data URI
      const base64Image = `data:${fileType.mime};base64,${image.buffer.toString(
        "base64"
      )}`;

      // Subir a Cloudinary
      const result = await cloudinary.uploader.upload(base64Image, {
        resource_type: "image",
        transformation: [
          { width: 800, height: 800, crop: "limit" },
          { quality: "auto" },
        ],
        format: "webp",
        folder: "productos",
      });

      console.log(`Imagen #${index + 1} subida con éxito:`, result.secure_url);
      return {
        url: result.secure_url,
        original_filename: result.original_filename,
      };
    } catch (error) {
      console.error(`Error al subir imagen #${index + 1}:`, error);
      throw error;
    }
  });

  try {
    const results = await Promise.all(uploadPromises);
    console.log("Resultados de la subida:", results);
    return results;
  } catch (uploadError) {
    console.error("Error al subir imágenes:", uploadError);
    throw uploadError;
  }
};

export { cloudinary };

export const deleteImageFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log("Imagen eliminada con éxito:", result);
    return result;
  } catch (error) {
    console.error("Error al eliminar imagen:", error);
    throw error;
  }
};

// cloudinary.v2.uploader
// .upload("dog.mp4", {
//   resource_type: "video",
//   public_id: "my_dog",
//   overwrite: true,
//   notification_url: "https://mysite.example.com/notify_endpoint"})
// .then(result=>console.log(result));

// const uploadPromises = images.map(
//   (image) =>
//     new Promise((resolve, reject) => {
//       const stream = cloudinary.uploader.upload_stream(
//         {
//           resource_type: "image",
//           folder: "productos",
//         },
//         (error, result) => {
//           if (error) {
//             console.error("Error al subir imagen:", error);
//             return reject(error);
//           }
//           resolve({
//             url: result.secure_url,
//             original_filename: result.original_filename,
//           });
//         }
//       );
//       stream.end(image.buffer);
//     })
// );

// return Promise.all(uploadPromises);
