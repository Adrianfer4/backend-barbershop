import {
  obtenerServicios,
  obtenerServicioPorId,
  insertarServicio,
  actualizarServicio,
  eliminarServicio,
} from "../models/servicioModel.js";

export const getServicios = async (req, res) => {
  try {
    const servicios = await obtenerServicios();
    res.json(servicios);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los servicios" });
  }
};

export const getServicio = async (req, res) => {
  try {
    const servicio = await obtenerServicioPorId(req.params.id);
    if (!servicio) return res.status(404).json({ error: "Servicio no encontrado" });
    res.json(servicio);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el servicio" });
  }
};

export const createServicio = async (req, res) => {
  try {
    const id = await insertarServicio(req.body);
    res.status(201).json({ mensaje: "Servicio creado", id });
  } catch (error) {
    res.status(500).json({ error: "Error al crear el servicio" });
  }
};

export const updateServicio = async (req, res) => {
  try {
    await actualizarServicio(req.params.id, req.body);
    res.json({ mensaje: "Servicio actualizado" });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el servicio" });
  }
};

export const deleteServicio = async (req, res) => {
  try {
    await eliminarServicio(req.params.id);
    res.json({ mensaje: "Servicio eliminado" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el servicio" });
  }
};
