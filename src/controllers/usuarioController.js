import {
  insertarUsuario,
  obtenerUsuarios,
  obtenerUsuarioPorId,
  actualizarUsuario,
  eliminarUsuario,
  obtenerUsuarioPorEmail,
  actualizarFotoPerfil,
  actualizarPassword,
  obtenerUsuarioConPasswordPorId 
} from "../models/usuarioModel.js";
import bcrypt from "bcrypt";

export const getUsuarios = async (req, res) => {
  const { rol } = req.query;

  try {
    const usuarios = await obtenerUsuarios(rol);
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
};

export const getUsuarioById = async (req, res) => {
  try {
    const usuario = await obtenerUsuarioPorId(req.params.id);
    if (usuario) {
      res.json(usuario);
    } else {
      res.status(404).json({ error: "Cliente no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el cliente" });
  }
};

export const createUsuario = async (req, res) => {
  try {
    const { nombre, apellido, telefono, email, password, rol } = req.body;

    if (!nombre || !apellido || !telefono || !email || !password || !rol) {
      return res
        .status(400)
        .json({ error: "Todos los campos son obligatorios" });
    }

    if (!/^\d{10}$/.test(telefono)) {
      return res.status(400).json({
        error: "El número de teléfono debe tener 10 dígitos numéricos",
      });
    }

    const existe = await obtenerUsuarioPorEmail(email);
    if (existe) {
      return res.status(400).json({ error: "El correo ya está registrado" });
    }

    const id = await insertarUsuario({
      nombre,
      apellido,
      telefono,
      email,
      password,
      rol,
      verificado: true,
    });

    res.status(201).json({ id, nombre, apellido, telefono, email, rol });
  } catch (error) {
    console.error("Error al crear cliente:", error);
    res.status(500).json({ error: "Error al crear el cliente" });
  }
};

export const subirFotoPerfil = async (req, res) => {
  const id = req.params.id;
  const archivo = req.file?.filename;

  if (!archivo) {
    return res.status(400).json({ mensaje: "No se subió ninguna imagen." });
  }

  try {
    const actualizado = await actualizarFotoPerfil(id, archivo);
    if (!actualizado) {
      return res.status(404).json({ mensaje: "Usuario no encontrado." });
    }

    res.json({
      mensaje: "Foto de perfil actualizada correctamente.",
      foto_perfil: archivo,
    });
  } catch (error) {
    console.error("Error al actualizar foto de perfil:", error);
    res.status(500).json({ mensaje: "Error del servidor al guardar la foto." });
  }
};

export const updateUsuario = async (req, res) => {
  try {
    const actualizado = await actualizarUsuario(req.params.id, req.body);
    if (actualizado) {
      res.json({ mensaje: "Cliente actualizado correctamente" });
    } else {
      res.status(404).json({ error: "Cliente no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el cliente" });
  }
};

export const deleteUsuario = async (req, res) => {
  try {
    const eliminado = await eliminarUsuario(req.params.id);
    if (eliminado) {
      res.json({ mensaje: "Cliente eliminado correctamente" });
    } else {
      res.status(404).json({ error: "Cliente no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el cliente" });
  }
};

export const cambiarPassword = async (req, res) => {
  const { id } = req.params;
  const { actual, nueva } = req.body;

  try {
    const usuario = await obtenerUsuarioConPasswordPorId(id);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (!usuario.password) {
      return res.status(500).json({ message: "No se pudo obtener la contraseña del usuario." });
    }

    const coincide = await bcrypt.compare(actual, usuario.password);
    if (!coincide) {
      return res.status(400).json({ message: "La contraseña actual es incorrecta" });
    }

    const nuevaHash = await bcrypt.hash(nueva, 10);
    await actualizarPassword(id, nuevaHash);

    res.json({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    console.error("Error al cambiar contraseña:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};