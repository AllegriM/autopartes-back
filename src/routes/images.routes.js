import { Router } from "express";
import AWS from "aws-sdk";

const router = Router();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

router.get("/upload-url", async (req, res) => {
  const fileName = req.query.fileName;
  const fileType = req.query.fileType;

  const s3Params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: fileName,
    Expires: 60, // URL válida por 1 minuto
    ContentType: fileType,
    ACL: "public-read",
  };

  try {
    const uploadURL = await s3.getSignedUrlPromise("putObject", s3Params);
    res.json({ uploadURL });
  } catch (error) {
    console.error("Error generando la URL firmada:", error);
    res.status(500).json({ error: "Error al generar URL" });
  }
});

export default router;
