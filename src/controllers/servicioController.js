import {
  obtenerServicios,
  obtenerServicioPorId,
  insertarServicio,
  actualizarServicio,
  eliminarServicio,
  contarServicios,
} from "../models/servicioModel.js";

export const getServicios = async (req, res) => {
  try {
    const servicios = await obtenerServicios();
    res.json(servicios);
  } catch (error) {
    console.error('Error en getServicios:', error);
    res.status(500).json({ error: "Error al obtener los servicios" });
  }
};

export const getServicio = async (req, res) => {
  try {
    const servicio = await obtenerServicioPorId(req.params.id);
    if (!servicio)
      return res.status(404).json({ error: "Servicio no encontrado" });
    res.json(servicio);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el servicio" });
  }
};

export const createServicio = async (req, res) => {
  try {
    const { nombre_servicio, descripcion, precio, duracion } = req.body;
    const imagen = req.file?.filename ?? req.body.imagen ?? null;

    if (!nombre_servicio || !descripcion || !precio || !duracion) {
      return res
        .status(400)
        .json({ error: "Nombre e imagen son obligatorios" });
    }

    const id = await insertarServicio({
      nombre_servicio,
      descripcion,
      precio,
      duracion,
      imagen,
    });
    res.status(201).json({ mensaje: "Servicio creado", id });
  } catch (error) {
    res.status(500).json({ error: "Error al crear el servicio" });
  }
};

export const updateServicio = async (req, res) => {
  try {
    const { nombre_servicio, descripcion, precio, duracion } = req.body;

    const existente = await obtenerServicioPorId(req.params.id);
    if (!existente) {
      return res.status(404).json({ error: "Servicio no encontrado" });
    }

    if (!nombre_servicio || !descripcion || !precio || !duracion) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const imagen = req.file?.filename || existente.imagen;

    await actualizarServicio(req.params.id, {
      nombre_servicio,
      descripcion,
      precio,
      duracion,
      imagen,
    });
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

export const totalServicios = async (req, res) => {
  try {
    const resultado = await contarServicios();
    res.json({ total: resultado.total });
  } catch (error) {
    console.error("Error al contar servicios:", error);
    res.status(500).json({ error: "Error al contar servicios" });
  }
};