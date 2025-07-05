import { Router } from "express";
import {
  getIngresos,
  getIngresosAgrupados,
  sumaTotalIngresos,
  ingresosPorBarbero,
} from "../controllers/ingresosController.js";
import { verificarToken } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", getIngresos);
router.get("/agrupado", verificarToken, getIngresosAgrupados);
router.get("/total", verificarToken, sumaTotalIngresos);
router.get("/por-barbero", verificarToken, ingresosPorBarbero);

export default router;
