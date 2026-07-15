# Bootcamp Proyecto — Portafolio 

Proyecto final de bootcamp: un sitio de portafolio personal con panel de administración propio. Es un monorepo con **frontend en Angular** y **backend en Express + MongoDB**, con autenticación por JWT.

## Estructura del repositorio

```
Bootcamp-Proyecto/
├── admin-app/    # Aplicación Angular: portafolio público + panel admin
├── backend/      # API REST con Express, Mongoose y JWT
└── CSS/          # Estilos base del portafolio (versión previa en HTML/Bootstrap)
```

## Funcionalidades

- **Portafolio público**: secciones de inicio, habilidades, portafolio y contacto. Los proyectos mostrados se cargan dinámicamente desde MongoDB (ya no están hardcodeados).
- **Formulario de contacto**: envía mensajes al backend sin necesidad de sesión.
- **Autenticación**: registro, login, recuperación y restablecimiento de contraseña con JWT.
- **Panel de administración** (`/dashboard`, protegido): un usuario con rol `admin` puede crear, editar y eliminar proyectos, además de ver y gestionar los mensajes recibidos por el formulario de contacto.

## Stack técnico

**Frontend (`admin-app/`)**
- Angular 22 (standalone components)
- Bootstrap para estilos
- Vitest para pruebas unitarias

**Backend (`backend/`)**
- Node.js + Express 5
- MongoDB con Mongoose
- Autenticación con JWT y contraseñas hasheadas con bcrypt
- `compression` y `cors` como middlewares globales

## API REST

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| POST | `/api/auth/register` | Público | Registrar usuario |
| POST | `/api/auth/login` | Público | Iniciar sesión |
| GET | `/api/auth/perfil` | Autenticado | Perfil del usuario logueado |
| POST | `/api/auth/forgot-password` | Público | Solicitar recuperación de contraseña |
| POST | `/api/auth/reset-password` | Público | Restablecer contraseña |
| GET | `/api/proyectos` | Público | Listar proyectos |
| GET | `/api/proyectos/:id` | Público | Obtener un proyecto |
| POST | `/api/proyectos` | Admin | Crear proyecto |
| PUT | `/api/proyectos/:id` | Admin | Actualizar proyecto |
| DELETE | `/api/proyectos/:id` | Admin | Eliminar proyecto |
| POST | `/api/mensajes` | Público | Enviar mensaje de contacto |
| GET | `/api/mensajes` | Admin | Listar mensajes |
| PATCH | `/api/mensajes/:id` | Admin | Marcar mensaje como leído |
| DELETE | `/api/mensajes/:id` | Admin | Eliminar mensaje |
| GET | `/api/health` | Público | Verificar que la API está viva |

