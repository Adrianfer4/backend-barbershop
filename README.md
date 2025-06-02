
# Backend - Jamayca Style Barbershop 💈

Este es el backend del sistema web para la barbería **Jamayca Style**, desarrollado con Node.js y Express. El objetivo es gestionar clientes, citas, servicios, productos, reportes financieros y un panel administrativo para el dueño de la barbería.

## 🛠️ Tecnologías utilizadas

- Node.js
- Express.js
- MySQL
- JWT (Json Web Tokens)
- bcryptjs
- dotenv

## 📁 Estructura del proyecto

```
src/
├── config/           # Configuración de base de datos
├── controllers/      # Lógica de negocio
├── models/           # Consultas a la base de datos
├── routes/           # Endpoints de la API
├── middlewares/      # Validaciones y protecciones
├── index.js          # Punto de entrada del servidor
```

## 📌 Funcionalidades implementadas

- [x] CRUD de clientes
- [x] Login y registro de usuarios con roles (cliente o admin)
- [x] Autenticación con JWT
- [x] Middleware de protección para rutas privadas
- [x] Unificación de usuarios (tabla única `usuarios` con campo `rol`)
- [x] Variables de entorno con `dotenv`
- [x] `.gitignore` para proteger archivos sensibles

## 🔐 Rutas de autenticación

| Método | Ruta               | Descripción             |
|--------|--------------------|-------------------------|
| POST   | /api/auth/register | Registro de usuario     |
| POST   | /api/auth/login    | Login y generación de token |

> Se requiere enviar los datos por `JSON` en el `body`.

## 📦 Instalación y uso

1. Clona el repositorio:

```bash
git clone https://github.com/tu-usuario/backend-barbershop.git
cd backend-barbershop
```

2. Instala las dependencias:

```bash
npm install
```

3. Crea un archivo `.env`:

```env
PORT=3000
DB_HOST=localhost
DB_USER=tu_usuario
DB_PASSWORD=tu_password
DB_NAME=jamaicaestylo_db
JWT_SECRET=clave_segura
```

4. Inicia el servidor:

```bash
node src/index.js
```

## 📮 Próximamente

- [ ] Gestión de citas
- [ ] Gestión de servicios y productos
- [ ] Reportes de ingresos y egresos
- [ ] Panel de administración
- [ ] Tests y documentación completa

---

> Proyecto en desarrollo – mantenido por [Nestor Adrian]
