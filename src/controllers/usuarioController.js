import {
  insertarUsuario,
  obtenerUsuarios,
  obtenerUsuarioPorId,
  actualizarUsuario,
  eliminarUsuario,
} from "../models/usuarioModel.js";

export const getUsuarios = async (req, res) => {
  try {
    const usuarios = await obtenerUsuarios();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los clientes" });
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

    const id = await insertarUsuario({
      nombre,
      apellido,
      telefono,
      email,
      password,
      rol,
    });
    res
      .status(201)
      .json({ id, nombre, apellido, telefono, email, password, rol });
  } catch (error) {
    res.status(500).json({ error: "Error al crear el cliente" });
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
