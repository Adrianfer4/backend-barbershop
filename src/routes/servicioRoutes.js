import express from "express";
import {
  getServicios,
  getServicio,
  createServicio,
  updateServicio,
  deleteServicio,
  totalServicios
} from "../controllers/servicioController.js";
import { crearUploadMiddleware } from "../middlewares/upload.js";

const uploadServicio = crearUploadMiddleware("servicios");

const router = express.Router();

router.get("/", getServicios);
router.get("/contar", totalServicios);
router.get("/:id", getServicio);
router.post("/", uploadServicio.single("imagen"), createServicio);
router.put("/:id", uploadServicio.single("imagen"), updateServicio);
router.delete("/:id", deleteServicio);

export default router;
