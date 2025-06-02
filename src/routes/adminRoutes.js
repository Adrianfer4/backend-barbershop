import express from "express";
import { verificarToken, soloAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Ruta protegida de ejemplo para el panel de administración
router.get("/panel", verificarToken, soloAdmin, (req, res) => {
  res.json({
    mensaje: "Bienvenido al panel de administración",
    usuario: req.usuario,
  });
});

export default router;
