import express from "express";
import {
  getServicios,
  getServicio,
  createServicio,
  updateServicio,
  deleteServicio,
} from "../controllers/servicioController.js";

const router = express.Router();

router.get("/", getServicios);
router.get("/:id", getServicio);
router.post("/", createServicio);
router.put("/:id", updateServicio);
router.delete("/:id", deleteServicio);

export default router;
