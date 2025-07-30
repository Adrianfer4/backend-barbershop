import cron from "node-cron";
import transporter from "../config/mailer.js";
import {
  obtenerCitasParaRecordatorio,
  marcarRecordatorioEnviado,
} from "../models/citaModel.js";
import { format } from "date-fns";
import { es } from "date-fns/locale";

// Ejecutar cada minuto
cron.schedule("* * * * *", async () => {
  try {
    const citas = await obtenerCitasParaRecordatorio();

    await Promise.all(
      citas
        .filter((cita) => cita.fecha && cita.hora)
        .map(async (cita) => {
          const fechaStr = new Date(cita.fecha).toISOString().split("T")[0];
          const horaCompleta =
            cita.hora.length === 5 ? `${cita.hora}:00` : cita.hora;
          const fechaHora = new Date(`${fechaStr}T${horaCompleta}`);

          if (isNaN(fechaHora.getTime())) {
            // console.error("Fecha inválida en cita:", cita);
            return;
          }

          const fechaFormateada = format(
            fechaHora,
            "EEEE d 'de' MMMM 'de' yyyy 'a las' HH:mm",
            { locale: es }
          );

          const mensaje = `
Hola ${cita.cliente_nombre},

Este es un recordatorio de tu cita de "${cita.nombre_servicio}" con ${cita.barbero_nombre} el día ${fechaFormateada}.

Si deseas cancelar, responde con: CANCELAR.

¡Te esperamos!
`;

          await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: cita.email,
            subject: "Recordatorio: tu cita es en 1 hora",
            text: mensaje,
          });

          await marcarRecordatorioEnviado(cita.id_cita);
        })
    );
  } catch (err) {
    console.error("Error en cron recordatorio:", err);
  }
});

export default cron;
