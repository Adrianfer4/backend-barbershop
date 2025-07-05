import { pool } from "../config/db.js";

// Insertar un ingreso (cuando una cita es realizada)
export const insertarIngreso = async ({
  id_cita,
  id_barbero,
  id_servicio,
  monto,
}) => {
  const [result] = await pool.query(
    `INSERT INTO ingresos (id_cita, id_barbero, id_servicio, monto, fecha) 
     VALUES (?, ?, ?, ?, NOW())`,
    [id_cita, id_barbero, id_servicio, monto]
  );
  return result.insertId;
};

// Eliminar ingreso cuando se cancela o revierte una cita
export const eliminarIngresoPorCita = async (id_cita) => {
  const [result] = await pool.query(`DELETE FROM ingresos WHERE id_cita = ?`, [
    id_cita,
  ]);
  return result.affectedRows > 0;
};

// Verificar si ya existe ingreso para una cita
export const obtenerIngresoPorCita = async (id_cita) => {
  const [rows] = await pool.query(`SELECT * FROM ingresos WHERE id_cita = ?`, [
    id_cita,
  ]);
  return rows[0];
};

// Obtener todos los ingresos (opcionalmente filtrado por fechas)
export const obtenerIngresos = async ({ desde, hasta, id_barbero }) => {
  let query = `SELECT i.*, u.nombre AS nombre_barbero, s.nombre_servicio
               FROM ingresos i
               JOIN usuarios u ON i.id_barbero = u.id_usuario
               JOIN servicios s ON i.id_servicio = s.id_servicio
               WHERE 1 = 1`;
  const params = [];

  if (desde) {
    query += " AND DATE(i.fecha) >= ?";
    params.push(desde);
  }
  if (hasta) {
    query += " AND DATE(i.fecha) <= ?";
    params.push(hasta);
  }
  if (id_barbero) {
    query += " AND i.id_barbero = ?";
    params.push(id_barbero);
  }

  const [rows] = await pool.query(query, params);
  return rows;
};

// Obtener ingresos por barbero agrupados por día/mes/año
export const obtenerTotalesAgrupados = async (filtro, año, mes, diaSemana) => {
  let selectPeriodo;
  let groupBy;
  let where = "WHERE 1 = 1";
  const params = [];

  switch (filtro) {
    case "dia":
      selectPeriodo = "DATE(i.fecha) AS periodo";
      groupBy = "DATE(i.fecha), i.id_barbero";
      break;
    case "semana":
      selectPeriodo = "WEEK(i.fecha, 1) AS periodo";
      groupBy = "WEEK(i.fecha, 1), i.id_barbero";
      break;
    case "mes":
      selectPeriodo = "MONTH(i.fecha) AS periodo";
      groupBy = "MONTH(i.fecha), i.id_barbero";
      break;
    case "año":
      selectPeriodo = "YEAR(i.fecha) AS periodo";
      groupBy = "YEAR(i.fecha), i.id_barbero";
      break;
    default:
      throw new Error("Filtro inválido");
  }

  let query = `
    SELECT 
      i.id_barbero,
      u.nombre,
      SUM(i.monto) AS total,
      ${selectPeriodo}
    FROM ingresos i
    JOIN usuarios u ON u.id_usuario = i.id_barbero
   ${where}
  `;

  if (año) {
    query += " AND YEAR(i.fecha) = ?";
    params.push(año);
  }

  if (mes && filtro === "mes") {
    query += " AND MONTH(i.fecha) = ?";
    params.push(mes);
  }

  if (diaSemana && filtro === "dia") {
    query += " AND DAYNAME(i.fecha) = ?";
    params.push(diaSemana);
  }

  query += ` GROUP BY ${groupBy}
             ORDER BY periodo ASC`;

  const [rows] = await pool.query(query, params);
  return rows;
};

export const totalIngresos = async () => {
  const [result] = await pool.query("SELECT SUM(monto) AS total FROM ingresos");
  return result[0];
};

export const obtenerTotalesPorBarbero = async () => {
  const [rows] = await pool.query(`
    SELECT u.nombre AS barbero, SUM(i.monto) AS total
FROM ingresos i
JOIN usuarios u ON i.id_barbero = u.id_usuario
WHERE MONTH(i.fecha) = MONTH(CURDATE())
  AND YEAR(i.fecha) = YEAR(CURDATE())
GROUP BY i.id_barbero;

`);

  return rows;
};
