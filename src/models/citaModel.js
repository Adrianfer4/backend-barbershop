import { pool } from "../config/db.js";

export const insertarCita = async ({
  id_usuario,
  fecha,
  hora,
  servicio,
  estado,
}) => {
  const [result] = await pool.query(
    "INSERT INTO citas (id_usuario, fecha, hora, servicio, estado) VALUES (?, ?, ?, ?, ?)",
    [id_usuario, fecha, hora, servicio, estado || "pendiente"]
  );
  return result.insertId;
};

export const obtenerCitas = async () => {
  const [rows] = await pool.query("SELECT * FROM citas");
  return rows;
};

export const obtenerHorariosEnFecha = async (fecha, id_usuario) => {
  const [rows] = await pool.query(
    `SELECT hora, duracion
     FROM citas
     JOIN servicios ON citas.servicio = servicios.id_servicio
     WHERE fecha = ? AND citas.id_usuario = ? AND estado != 'cancelada'`,
    [fecha, id_usuario]
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
