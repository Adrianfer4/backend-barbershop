import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import "./cronJobs/recordatorio.js";

import usuarioRoutes from "./routes/usuarioRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import servicioRoutes from "./routes/servicioRoutes.js";
import citasRoutes from "./routes/citasRoutes.js";
import ingresosRoutes from "./routes/ingresosRoutes.js";
dotenv.config();

console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DATABASE_URL:', process.env.DATABASE_URL);

const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://frontend-barbershop-kappa.vercel.app",
    ],
    credentials: true,
  }),
);
app.use(express.json());

app.use("/api/usuarios", usuarioRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

app.use("/api/servicios", servicioRoutes);

app.use("/api/citas", citasRoutes);
app.use("/uploads", express.static(path.resolve("uploads")));

app.use("/api/ingresos", ingresosRoutes);

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("Servidor de barbershop funcionando");
});

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
