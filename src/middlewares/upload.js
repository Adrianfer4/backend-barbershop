import multer from "multer";
import path from "path";
import fs from "fs";

// Asegurar que exista la carpeta uploads/servicios
const dir = path.resolve("uploads/servicios");
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/servicios");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const nombre = `servicio_${Date.now()}${ext}`;
    cb(null, nombre);
  },
});

const fileFilter = (req, file, cb) => {
  const tiposPermitidos = /jpeg|jpg|png|webp/;
  const mimetype = tiposPermitidos.test(file.mimetype);
  const extname = tiposPermitidos.test(path.extname(file.originalname));
  cb(null, mimetype && extname);
};

export const uploadServicio = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // máximo 2MB
});
