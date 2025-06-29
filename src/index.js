import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import './cronJobs/recordatorio.js';

import usuarioRoutes from "./routes/usuarioRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import servicioRoutes from "./routes/servicioRoutes.js";
import citasRoutes from "./routes/citasRoutes.js";
import ingresosRoutes from "./routes/ingresosRoutes.js"
dotenv.config();

const app = express();
app.use(cors());
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
