import {
  insertarUsuario,
  obtenerUsuarioPorEmail,
} from "../models/usuarioModel.js";
import { pool } from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import transporter from "../config/mailer.js";

const SECRET = process.env.JWT_SECRET || "clave_secreta";

export const register = async (req, res) => {
  try {
    const {
      nombre,
      apellido,
      telefono,
      email,
      password,
      rol = "cliente",
    } = req.body;

    const existe = await obtenerUsuarioPorEmail(email);

    if (existe) {
      if (existe.verificado) {
        return res.status(400).json({ error: "El email ya está registrado" });
      } else {
        // Reenviar link de verificación
        const token = jwt.sign({ id: existe.id_usuario }, SECRET, {
          expiresIn: "15m",
        });
        const verificationLink = `http://localhost:3000/api/auth/verificar-correo?token=${token}`;

        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: email,
          subject: "Verifica tu correo electrónico",
          html: `
            <p>Hola ${existe.nombre},</p>
            <p>Parece que ya te registraste pero no verificaste tu correo.</p>
            <p>Haz clic en el siguiente enlace para verificar tu cuenta:</p>
            <a href="${verificationLink}">${verificationLink}</a>
            <p>Este enlace expirará en 15 minutos.</p>
          `,
        });

        return res.status(200).json({
          mensaje:
            "El email ya está registrado pero no verificado. Se ha reenviado el correo.",
        });
      }
    }

    const id = await insertarUsuario({
      nombre,
      apellido,
      telefono,
      email,
      password,
      rol,
    });

    const token = jwt.sign({ id }, SECRET, { expiresIn: "15m" });

    const verificationLink = `http://localhost:3000/api/auth/verificar-correo?token=${token}`;

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verifica tu correo electrónico",
      html: `
        <p>Hola ${nombre},</p>
        <p>Haz clic en el siguiente enlace para verificar tu correo:</p>
        <a href="${verificationLink}">${verificationLink}</a>
        <p>Este enlace expirará en 15 minutos.</p>
      `,
    });

    // console.log("Correo enviado:", info.messageId);
    // console.log("Verifica tu correo:", verificationLink);

    res.status(201).json({ mensaje: "Usuario registrado correctamente", id });
  } catch (error) {
    console.error("Error al registrar o enviar correo:", error);
    res.status(500).json({ error: "Error al registrar usuario" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const usuario = await obtenerUsuarioPorEmail(email);
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const match = await bcrypt.compare(password, usuario.password);
    if (!match) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      {
        id: usuario.id_usuario,
        rol: usuario.rol,
        email: usuario.email,
      },
      SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      mensaje: "Login exitoso",
      token,
      usuario: {
        id: usuario.id_usuario,
        nombre: usuario.nombre,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Error en el login" });
  }
};

export const verificarCorreo = async (req, res) => {
  const { token } = req.query;

  try {
    const decoded = jwt.verify(token, SECRET);
    const userId = decoded.id;

    await pool.query(
      "UPDATE usuarios SET verificado = true WHERE id_usuario = ?",
      [userId]
    );

    res.send(`
      <html>
        <head>
          <meta charset="UTF-8" />
          <title>Verificación exitosa</title>
          <script>
            setTimeout(() => {
              window.location.href = "http://localhost:5173/login";
            }, 3000);
          </script>
        </head>
        <body style="font-family:sans-serif;text-align:center;padding-top:50px;">
          <h1>✅ Correo verificado correctamente</h1>
          <p>Serás redirigido al login en unos segundos...</p>
        </body>
      </html>
    `);
  } catch (error) {
    console.error("Error al verificar token:", error);
    res.status(400).send(`
      <html>
        <head><meta charset="UTF-8" /></head>
        <body style="font-family:sans-serif;text-align:center;padding-top:50px;">
          <h1>❌ Token inválido o expirado</h1>
          <p>Por favor solicita un nuevo enlace de verificación.</p>
        </body>
      </html>
    `);
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const usuario = await obtenerUsuarioPorEmail(email);
    if (!usuario) {
      return res.status(404).json({ error: "No existe una cuenta con ese correo" });
    }

    const token = jwt.sign({ id: usuario.id_usuario }, SECRET, { expiresIn: "15m" });

    const resetLink = `http://localhost:5173/reset-password?token=${token}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Restablecer contraseña",
      html: `
        <p>Hola ${usuario.nombre},</p>
        <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>Este enlace expirará en 15 minutos.</p>
      `,
    });

    res.json({ mensaje: "Se ha enviado un enlace de recuperación a tu correo" });
  } catch (error) {
    console.error("Error en forgotPassword:", error);
    res.status(500).json({ error: "Error al enviar correo de recuperación" });
  }
};

export const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  try {
    const decoded = jwt.verify(token, SECRET);
    const userId = decoded.id;

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      "UPDATE usuarios SET password = ? WHERE id_usuario = ?",
      [hashedPassword, userId]
    );

    res.json({ mensaje: "Contraseña actualizada correctamente" });
  } catch (error) {
    console.error("Error en resetPassword:", error);
    res.status(400).json({ error: "Token inválido o expirado" });
  }
};
