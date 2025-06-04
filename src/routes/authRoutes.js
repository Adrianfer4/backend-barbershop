import { Router } from "express";
import { register, login, verificarCorreo, forgotPassword,
  resetPassword,  } from "../controllers/authController.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get('/verificar-correo', verificarCorreo);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword); 

export default router;
