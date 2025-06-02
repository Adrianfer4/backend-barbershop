import {
  insertarUsuario,
  obtenerUsuarioPorEmail,
} from "../models/usuarioModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "clave_secreta";

export const register = async (req, res) => {
  try {
    const { nombre, apellido, telefono, email, password, rol } = req.body;

    const existe = await obtenerUsuarioPorEmail(email);
    if (existe) {
      return res.status(400).json({ error: "El email ya está registrado" });
    }

    const id = await insertarUsuario({
      nombre,
      apellido,
      telefono,
      email,
      password,
      rol,
    });
    res.status(201).json({ mensaje: "Usuario registrado correctamente", id });
  } catch (error) {
    res.status(500).json({ error: "Error al registrar usuario" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const usuario = await obtenerUsuarioPorEmail(email);
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const match = await bcrypt.compare(password, usuario.password);
    if (!match) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      {
        id: usuario.id_usuario,
        rol: usuario.rol,
        email: usuario.email,
      },
      SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      mensaje: "Login exitoso",
      token,
      usuario: {
        id: usuario.id_usuario,
        nombre: usuario.nombre,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Error en el login" });
  }
};
