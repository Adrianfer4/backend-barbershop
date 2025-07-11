import { pool } from "../config/db.js";

export const obtenerServicios = async () => {
  const [rows] = await pool.query(
    "SELECT id_servicio, nombre_servicio, descripcion, precio, duracion, imagen FROM servicios"
  );
  return rows;
};

export const obtenerServicioPorId = async (id) => {
  const [rows] = await pool.query(
    "SELECT * FROM servicios WHERE id_servicio = ?",
    [id]
  );
  return rows[0];
};

export const obtenerDuracionDelServicio = async (id_servicio) => {
  const [[servicio]] = await pool.query(
    "SELECT duracion FROM servicios WHERE id_servicio = ?",
    [id_servicio]
  );

  return servicio?.duracion || null;
};

export const insertarServicio = async ({
  nombre_servicio,
  descripcion,
  precio,
  duracion,
  imagen,
}) => {
  const [result] = await pool.query(
    "INSERT INTO servicios (nombre_servicio, descripcion, precio, duracion, imagen) VALUES (?, ?, ?, ?, ?)",
    [nombre_servicio, descripcion, precio, duracion, imagen]
  );
  return result.insertId;
};

export const actualizarServicio = async (
  id,
  { nombre_servicio, descripcion, precio, duracion, imagen }
) => {
  await pool.query(
    "UPDATE servicios SET nombre_servicio = ?, descripcion = ?, precio = ?, duracion = ?, imagen = ? WHERE id_servicio = ?",
    [nombre_servicio, descripcion, precio, duracion, imagen, id]
  );
};

export const eliminarServicio = async (id) => {
  await pool.query("DELETE FROM servicios WHERE id_servicio = ?", [id]);
};

export const contarServicios = async () => {
  const [rows] = await pool.query("SELECT COUNT(*) AS total FROM servicios");
  return rows[0];
};
