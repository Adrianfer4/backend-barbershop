import { Router } from "express";
import {
  getIngresos,
  getIngresosAgrupados,
  sumaTotalIngresos,
  ingresosPorBarbero,
  postIngreso,
  putIngreso,
  deleteIngreso
} from "../controllers/ingresosController.js";
import { verificarToken } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", getIngresos);
router.get("/agrupado", verificarToken, getIngresosAgrupados);
router.get("/total", verificarToken, sumaTotalIngresos);
router.get("/por-barbero", verificarToken, ingresosPorBarbero);

router.post("/", verificarToken, postIngreso);
router.delete("/:id", verificarToken, deleteIngreso);
router.put("/:id", verificarToken, putIngreso);

export default router;
