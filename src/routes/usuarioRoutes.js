import { Router } from "express";
import {
  getUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  deleteUsuario,
  subirFotoPerfil,
  cambiarPassword,
  getUsuariosBarberos,
  contarUsuarios,
} from "../controllers/usuarioController.js";
import { crearUploadMiddleware } from "../middlewares/upload.js";

const uploadUsuario = crearUploadMiddleware("usuarios");

const router = Router();

router.get("/contar", contarUsuarios);

router.get("/", getUsuarios);
router.get("/barberos", getUsuariosBarberos);
router.get("/:id", getUsuarioById);
router.post("/", createUsuario);
router.put("/:id", updateUsuario);
router.delete("/:id", deleteUsuario);router.put("/:id/password", cambiarPassword);

router.put("/:id/foto", uploadUsuario.single("foto"), subirFotoPerfil);

export default router;
