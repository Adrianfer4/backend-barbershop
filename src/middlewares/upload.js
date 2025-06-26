import multer from "multer";
import path from "path";
import fs from "fs";

export const crearUploadMiddleware = (carpetaDestino) => {
  const dir = path.resolve(`uploads/${carpetaDestino}`);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, `uploads/${carpetaDestino}`);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const nombre = `${carpetaDestino}_${Date.now()}${ext}`;
      cb(null, nombre);
    },
  });

  const fileFilter = (req, file, cb) => {
    const tiposPermitidos = /jpeg|jpg|png|webp/;
    const mimetype = tiposPermitidos.test(file.mimetype);
    const extname = tiposPermitidos.test(
      path.extname(file.originalname).toLowerCase()
    );
    cb(null, mimetype && extname);
  };

  return multer({
    storage,
    fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 },
  });
};
