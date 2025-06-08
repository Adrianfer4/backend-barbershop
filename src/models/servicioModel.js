import { pool } from "../config/db.js";

export const obtenerServicios = async () => {
  const [rows] = await pool.query("SELECT id_servicio, nombre_servicio, descripcion, precio, duracion FROM servicios");
  return rows;
};

export const obtenerServicioPorId = async (id) => {
  const [rows] = await pool.query("SELECT * FROM servicios WHERE id_servicio = ?", [id]);
  return rows[0];
};

export const insertarServicio = async ({ nombre_servicio, descripcion, precio, duracion }) => {
  const [result] = await pool.query(
    "INSERT INTO servicios (nombre_servicio, descripcion, precio, duracion) VALUES (?, ?, ?, ?)",
    [nombre_servicio, descripcion, precio, duracion]
  );
  return result.insertId;
};

export const actualizarServicio = async (id, { nombre_servicio, descripcion, precio, duracion }) => {
  await pool.query(
    "UPDATE servicios SET nombre_servicio = ?, descripcion = ?, precio = ?, duracion = ? WHERE id_servicio = ?",
    [nombre_servicio, descripcion, precio, duracion, id]
  );
};

export const eliminarServicio = async (id) => {
  await pool.query("UPDATE servicios SET activo = FALSE WHERE id_servicio = ?", [id]);
};
