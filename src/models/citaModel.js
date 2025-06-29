import { pool } from "../config/db.js";

export const insertarCita = async ({
  id_usuario,
  fecha,
  hora,
  servicio,
  estado,
  id_barbero,
}) => {
  const [result] = await pool.query(
    "INSERT INTO citas (id_usuario, fecha, hora, servicio, estado, id_barbero) VALUES (?, ?, ?, ?, ?, ?)",
    [id_usuario, fecha, hora, servicio, estado || "pendiente", id_barbero]
  );
  return result.insertId;
};

export const obtenerCitas = async () => {
  const [rows] = await pool.query("SELECT * FROM citas");
  return rows;
};

// src/models/citaModel.js
export const obtenerCitasAdmin = async ({ estado, soloHoy }) => {
  let query = `
    SELECT
      c.id_cita,
      cliente.nombre AS cliente_nombre,
      barbero.nombre AS barbero_nombre,
      c.fecha,
      c.hora,
      s.nombre_servicio,
      c.estado
    FROM citas c
    JOIN usuarios cliente ON c.id_usuario = cliente.id_usuario
    JOIN usuarios barbero ON c.id_barbero = barbero.id_usuario
    JOIN servicios s ON c.servicio = s.id_servicio
    WHERE c.fecha >= CURDATE()
  `;

  const params = [];

  if (estado) {
    query += ` AND c.estado = ?`;
    params.push(estado);
  }

  if (soloHoy) {
    query += ` AND c.fecha = CURDATE()`;
  }

  query += ` ORDER BY c.fecha ASC, c.hora ASC`;

  const [rows] = await pool.query(query, params);
  return rows;
};

export const cambiarEstadoCita = async (id_cita, nuevoEstado) => {
  await pool.query("UPDATE citas SET estado = ? WHERE id_cita = ?", [
    nuevoEstado,
    id_cita,
  ]);
};

export const obtenerCitaConDetalles = async (idCita) => {
  const [rows] = await pool.query(
    `
    SELECT c.id_cita, c.id_barbero, c.servicio AS id_servicio, s.precio
    FROM citas c
    JOIN servicios s ON c.servicio = s.id_servicio
    WHERE c.id_cita = ?
  `,
    [idCita]
  );
  // console.log("Cita con detalles:", rows[0]);
  return rows[0];
};

export const obtenerHorariosEnFecha = async (fecha, id_barbero) => {
  const [rows] = await pool.query(
    `SELECT hora, duracion
     FROM citas
     JOIN servicios ON citas.servicio = servicios.id_servicio
     WHERE fecha = ? AND citas.id_barbero = ? AND estado != 'cancelada'`,
    [fecha, id_barbero]
  );
  return rows;
};

export const actualizarCita = async (id, datos) => {
  const { fecha, hora, servicio, estado } = datos;
  const [result] = await pool.query(
    "UPDATE citas SET fecha = ?, hora = ?, servicio = ?, estado = ? WHERE id_cita = ?",
    [fecha, hora, servicio, estado, id]
  );
  return result.affectedRows > 0;
};

export const eliminarCita = async (id) => {
  const [result] = await pool.query("DELETE FROM citas WHERE id_cita = ?", [
    id,
  ]);
  return result.affectedRows > 0;
};

// Obtiene citas pendientes que ocurren en 60 minutos y aún no tienen recordatorio enviado
export const obtenerCitasParaRecordatorio = async () => {
  const [rows] = await pool.query(`
    SELECT 
      c.id_cita,
      c.fecha,
      c.hora,
      u.email,
      u.nombre AS cliente_nombre,
      b.nombre AS barbero_nombre,
      s.nombre_servicio
    FROM citas c
    JOIN usuarios u ON c.id_usuario = u.id_usuario
    JOIN usuarios b ON c.id_barbero = b.id_usuario
    JOIN servicios s ON c.servicio = s.id_servicio
    WHERE 
      c.estado = 'pendiente'
      AND c.recordatorio_enviado = 0
      AND TIMESTAMPDIFF(MINUTE, NOW(), CONCAT(c.fecha, ' ', c.hora)) BETWEEN 59 AND 61
  `);
  return rows;
};

// Marca la cita como recordatorio enviado
export const marcarRecordatorioEnviado = async (id_cita) => {
  await pool.query(
    `UPDATE citas SET recordatorio_enviado = 1 WHERE id_cita = ?`,
    [id_cita]
  );
};
