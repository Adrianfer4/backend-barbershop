import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "clave_secreta";

// Verifica si el usuario tiene un token válido
export const verificarToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token no proporcionado" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET);
    req.usuario = decoded; // Guardamos los datos del usuario en la request
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido" });
  }
};

// Verifica si el usuario tiene el rol de admin
export const soloAdmin = (req, res, next) => {
  if (req.usuario.rol !== "admin") {
    return res
      .status(403)
      .json({ error: "Acceso denegado: solo administradores" });
  }
  next();
};
