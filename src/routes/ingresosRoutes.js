import { Router } from "express";
import { getIngresos, getIngresosAgrupados } from "../controllers/ingresosController.js";
import { verificarToken } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", getIngresos);
router.get('/agrupado', verificarToken, getIngresosAgrupados);

export default router;
