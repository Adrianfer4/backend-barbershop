import { pool } from "../config/db.js";
import bcrypt from "bcrypt";

export const insertarUsuario = async (usuario) => {
  const { nombre, apellido, telefono, email, password, rol } = usuario;
  const hashedPassword = await bcrypt.hash(password, 10);
  const verificado = usuario.verificado ?? false;

  const [result] = await pool.query(
    "INSERT INTO usuarios (nombre, apellido, telefono, email, password, rol, verificado) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [nombre, apellido, telefono, email, hashedPassword, rol, verificado]
  );
  return result.insertId;
};

export const obtenerUsuarios = async (rol) => {
  if (rol) {
    const [rows] = await pool.query("SELECT * FROM usuarios WHERE rol = ?", [
      rol,
    ]);
    return rows;
  } else {
    const [rows] = await pool.query("SELECT * FROM usuarios");
    return rows;
  }
};

export const obtenerUsuarioPorId = async (id) => {
  const [rows] = await pool.query(
    "SELECT id_usuario, nombre, apellido, telefono, email, rol, foto_perfil FROM usuarios WHERE id_usuario = ?",
    [id]
  );
  return rows[0];
};

// Obtener todos los usuarios con rol "barbershop"
export const obtenerUsuariosBarberos = async () => {
  const [rows] = await pool.query(
    `SELECT id_usuario, nombre, apellido, telefono, email, rol, foto_perfil 
     FROM usuarios 
     WHERE rol = 'barbershop'`
  );
  return rows;
};

export const obtenerUsuarioConPasswordPorId = async (id) => {
  const [rows] = await pool.query(
    "SELECT id_usuario, password FROM usuarios WHERE id_usuario = ?",
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

  let query =
    "UPDATE usuarios SET nombre = ?, apellido = ?, telefono = ?, email = ?";
  let params = [nombre, apellido, telefono, email];

  if (rol !== undefined) {
    query += ", rol = ?";
    params.push(rol);
  }

  query += " WHERE id_usuario = ?";
  params.push(id);

  const [result] = await pool.query(query, params);
  return result.affectedRows > 0;
};

export const actualizarFotoPerfil = async (id, nombreArchivo) => {
  const [result] = await pool.query(
    "UPDATE usuarios SET foto_perfil = ? WHERE id_usuario = ?",
    [nombreArchivo, id]
  );
  return result.affectedRows > 0;
};

export const actualizarPassword = async (id, passwordHash) => {
  await pool.query("UPDATE usuarios SET password = ? WHERE id_usuario = ?", [
    passwordHash,
    id,
  ]);
};

export const eliminarUsuario = async (id) => {
  const [result] = await pool.query(
    "DELETE FROM usuarios WHERE id_usuario = ?",
    [id]
  );
  return result.affectedRows > 0;
};

export const contarUsuariosDB = async () => {
  const [result] = await pool.query("SELECT COUNT(*) AS total FROM usuarios WHERE rol = 'cliente'");
  return result[0];
};

