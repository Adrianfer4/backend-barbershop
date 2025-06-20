import {
  insertarCita,
  obtenerCitas,
  obtenerHorariosEnFecha,
  actualizarCita,
  eliminarCita,
} from "../models/citaModel.js";
import { obtenerDuracionDelServicio } from "../models/servicioModel.js";

const HORA_APERTURA = 9 * 60; 
const HORA_CIERRE = 18 * 60; 

const aMin = (hora) => {
  const [h, m] = hora.split(":").map(Number);
  return h * 60 + m;
};

export const crearCita = async (req, res) => {
  try {
    const {
      id_usuario,
      fecha,
      hora,
      servicio,
      estado = "pendiente",
    } = req.body;

    if (!id_usuario || !fecha || !hora || !servicio) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    // Obtener duración del servicio
    const duracion = await obtenerDuracionDelServicio(servicio);
    if (!duracion) {
      return res.status(404).json({ error: "Servicio no encontrado" });
    }

    // Obtener todas las citas en esa fecha
    const citas = await obtenerHorariosEnFecha(fecha, id_usuario);

    const nuevaInicio = aMin(hora);
    const nuevaFin = nuevaInicio + duracion;

    const conflicto = citas.some((cita) => {
      const inicio = aMin(cita.hora);
      return nuevaInicio < inicio + cita.duracion && nuevaFin > inicio;
    });

    if (conflicto) {
      return res
        .status(409)
        .json({ error: "Ese rango de horario ya está ocupado" });
    }

    const id = await insertarCita({
      id_usuario,
      fecha,
      hora,
      servicio,
      estado,
    });
    res.status(201).json({ mensaje: "Cita registrada", id });
  } catch (error) {
    console.error("Error al crear cita:", error);
    res.status(500).json({ error: "Error interno al crear cita" });
  }
};

export const listarCitas = async (req, res) => {
  try {
    const citas = await obtenerCitas();
    res.json(citas);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las citas" });
  }
};

export const editarCita = async (req, res) => {
  try {
    const actualizado = await actualizarCita(req.params.id, req.body);
    if (actualizado) {
      res.json({ mensaje: "Cita actualizada correctamente" });
    } else {
      res.status(404).json({ error: "Cita no encontrada" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar la cita" });
  }
};

export const borrarCita = async (req, res) => {
  try {
    const eliminado = await eliminarCita(req.params.id);
    if (eliminado) {
      res.json({ mensaje: "Cita eliminada correctamente" });
    } else {
      res.status(404).json({ error: "Cita no encontrada" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar la cita" });
  }
};

export const obtenerHorariosLibres = async (req, res) => {
  const { fecha, servicio, barbero } = req.query;

  if (!fecha || !servicio || !barbero)
    return res
      .status(400)
      .json({ error: "Fecha, servicio y barbero son obligatorios" });

  const duracionToMin = (duracionStr) => {
    const [horas, minutos] = duracionStr.split(":").map(Number);
    return horas * 60 + minutos;
  };

  try {
    const duracionRaw = await obtenerDuracionDelServicio(servicio);
    if (!duracionRaw) {
      return res
        .status(404)
        .json({ error: "Duración del servicio no encontrada" });
    }

    const duracion = duracionToMin(duracionRaw);

    const citasOcupadas = await obtenerHorariosEnFecha(fecha, barbero);
    const horariosDisponibles = [];

    // Convertir citas existentes a intervalos [inicio, fin) en minutos
    const intervalosOcupados = citasOcupadas.map((cita) => {
      const inicio = aMin(cita.hora);
      const duracionMin = duracionToMin(cita.duracion);
      return [inicio, inicio + duracionMin];
    });

    // Determinar límites temporales
    const ahora = new Date();
    const esHoy = fecha === ahora.toISOString().split("T")[0];
    const minActual = esHoy
      ? ahora.getHours() * 60 + ahora.getMinutes()
      : -Infinity;
    const minInicio = Math.max(HORA_APERTURA, minActual);
    const minFin = HORA_CIERRE - duracion;

    if (minInicio > minFin) {
      return res.json([]);
    }

    // Generar candidatos y verificar solapamiento
    for (let min = minInicio; min <= minFin; min += 10) {
      const intervaloNuevo = [min, min + duracion];

      // Verificar solapamiento con citas existentes
      const haySolapamiento = intervalosOcupados.some(
        ([inicio, fin]) => intervaloNuevo[0] < fin && intervaloNuevo[1] > inicio
      );

      if (!haySolapamiento) {
        const h = String(Math.floor(min / 60)).padStart(2, "0");
        const m = String(min % 60).padStart(2, "0");
        horariosDisponibles.push(`${h}:${m}`);
      }
    }

    res.json(horariosDisponibles);
  } catch (error) {
    console.error("Error al obtener horarios:", error);
    res
      .status(500)
      .json({ error: "Error interno al obtener horarios disponibles" });
  }
};
