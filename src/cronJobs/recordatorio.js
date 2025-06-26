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

    for (const cita of citas) {
      const fechaFormateada = format(
        new Date(`${cita.fecha}T${cita.hora}`),
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
    }
  } catch (err) {
    console.error("Error en cron recordatorio:", err);
  }
});

export default cron;
