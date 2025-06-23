import express from "express";
import {
  getServicios,
  getServicio,
  createServicio,
  updateServicio,
  deleteServicio,
} from "../controllers/servicioController.js";
import { uploadServicio } from "../middlewares/upload.js";

const router = express.Router();

router.get("/", getServicios);
router.get("/:id", getServicio);
router.post("/", uploadServicio.single("imagen"), createServicio);
router.put("/:id", uploadServicio.single("imagen"), updateServicio);
router.delete("/:id", deleteServicio);

export default router;
