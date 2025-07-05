import {
  obtenerIngresos,
  obtenerTotalesAgrupados,
  obtenerTotalesPorBarbero,
  totalIngresos,
} from "../models/ingresosModel.js";

export const getIngresos = async (req, res) => {
  try {
    const { desde, hasta, id_barbero } = req.query;
    const ingresos = await obtenerIngresos({ desde, hasta, id_barbero });
    res.json(ingresos);
  } catch (error) {
    console.error("Error al obtener ingresos:", error);
    res.status(500).json({ error: "Error al obtener ingresos" });
  }
};

export const getIngresosAgrupados = async (req, res) => {
  const { filtro, año, mes, dia } = req.query;

  if (!["dia", "semana", "mes", "año"].includes(filtro)) {
    return res.status(400).json({ error: "Filtro inválido" });
  }

  try {
    const datos = await obtenerTotalesAgrupados(filtro, año, mes, dia);
    res.json(datos);
  } catch (error) {
    console.error("Error al obtener ingresos agrupados:", error);
    res.status(500).json({ error: "Error al obtener ingresos agrupados" });
  }
};

export const sumaTotalIngresos = async (req, res) => {
  try {
    const total = await totalIngresos();
    res.json({ total: total.total || 0 });
  } catch (error) {
    console.error("Error al obtener total de ingresos:", error);
    res.status(500).json({ error: "Error al calcular ingresos" });
  }
};

export const ingresosPorBarbero = async (req, res) => {
  try {
    const datos = await obtenerTotalesPorBarbero();
    res.json(datos);
  } catch (error) {
    console.error("Error al obtener ingresos por barbero:", error);
    res.status(500).json({ error: "Error al obtener ingresos por barbero" });
  }
};
