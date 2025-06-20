import express from "express";
import {
  crearCita,
  listarCitas,
  editarCita,
  borrarCita,
  obtenerHorariosLibres,
} from "../controllers/citaController.js";

const router = express.Router();

router.get("/", listarCitas);
router.get("/horarios", obtenerHorariosLibres);
router.post("/", crearCita);
router.put("/:id", editarCita);
router.delete("/:id", borrarCita);

export default router;
