import { pool } from "../config/db.js";
import bcrypt from "bcrypt";

export const insertarUsuario = async (usuario) => {
  const { nombre, apellido, telefono, email, password, rol } = usuario;
  const hashedPassword = await bcrypt.hash(password, 10);

  const [result] = await pool.query(
    "INSERT INTO usuarios (nombre, apellido, telefono, email, password, rol) VALUES (?, ?, ?, ?, ?, ?)",
    [nombre, apellido, telefono, email, hashedPassword, rol]
  );
  return result.insertId;
};

export const obtenerUsuarios = async () => {
  const [rows] = await pool.query(
    "SELECT id_usuario, nombre, apellido, telefono, email, rol FROM usuarios"
  );
  return rows;
};

export const obtenerUsuarioPorId = async (id) => {
  const [rows] = await pool.query(
    "SELECT id_usuario, nombre, apellido, telefono, email, rol FROM usuarios WHERE id_usuario = ?",
    [id]
  );
  return rows[0];
};

export const obtenerUsuarioPorEmail = async (email) => {
  const [rows] = await pool.query("SELECT * FROM usuarios WHERE email = ?", [
    email,
  ]);
  return rows[0];
};

export const actualizarUsuario = async (id, usuario) => {
  const { nombre, apellido, telefono, email, rol } = usuario;
  const [result] = await pool.query(
    "UPDATE usuarios SET nombre = ?, apellido = ?, telefono = ?, email = ?, rol = ? WHERE id_usuario = ?",
    [nombre, apellido, telefono, email, rol, id]
  );
  return result.affectedRows > 0;
};

export const eliminarUsuario = async (id) => {
  const [result] = await pool.query(
    "DELETE FROM usuarios WHERE id_usuario = ?",
    [id]
  );
  return result.affectedRows > 0;
};
