import express from "express";
import {
  crearCita,
  listarCitas,
  editarCita,
  borrarCita,
  obtenerHorariosLibres,
  getCitasAdmin,
  actualizarEstadoCita,
  TotalCitas,
  citasPorDia,
} from "../controllers/citaController.js";
import { verificarToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", listarCitas);
router.get("/horarios", obtenerHorariosLibres);
router.post("/", verificarToken, crearCita);
router.put("/:id/estado", actualizarEstadoCita);
router.put("/:id", editarCita);
router.delete("/:id", borrarCita);

router.get("/admin", getCitasAdmin);

router.get("/contar", TotalCitas);
router.get("/por-dia", verificarToken, citasPorDia);

export default router;
