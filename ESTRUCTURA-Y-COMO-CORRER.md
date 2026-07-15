# Estructura del proyecto y cómo correrlo y probarlo

## Ruta completa

```
Proyecto-Mi protafolio/
├── index.html                     ← portafolio original, ya no se usa (todo vive en admin-app)
├── CSS/                           ← estilos originales, ya no se usan directamente (copiados a admin-app)
│
├── backend/                       ← API REST (Node.js + Express + MongoDB + JWT) + sirve la app
│   ├── server.js                  ← punto de entrada: sirve la API y el build de Angular ya compilado
│   ├── .env                        ← tus credenciales reales (ya configurado y probado)
│   ├── config/db.js                ← conexión a MongoDB con Mongoose
│   ├── models/Usuario.js           ← login/registro/recuperación de contraseña
│   ├── models/Proyecto.js          ← proyectos del portafolio
│   ├── models/Mensaje.js           ← mensajes del formulario "Contáctame"
│   ├── middleware/auth.middleware.js  ← valida el JWT en rutas protegidas
│   ├── middleware/admin.middleware.js ← exige rol "admin" en rutas protegidas
│   ├── controllers/ y routes/      ← auth, proyectos, mensajes
│   └── package.json                ← incluye "compression" para servir todo más rápido
│
└── admin-app/                     ← App Angular completa (Angular CLI 22, standalone)
    ├── dist/admin-app/browser/     ← BUILD DE PRODUCCIÓN — esto es lo que sirve el backend
    └── src/app/
        ├── components/home/        ← portafolio + formulario de contacto + portafolio dinámico
        ├── components/login/, register/, forgot-password/, reset-password/
        ├── components/dashboard/   ← CRUD de proyectos + mensajes recibidos (protegido, solo admin)
        ├── services/, guards/, interceptors/, models/
        └── styles/portafolio/      ← tus 7 hojas CSS, copiadas tal cual
```

## Cómo quedó armado (importante: cambió la forma de correrlo)

Antes había que correr **dos procesos separados**: el backend (puerto 4000) y `ng serve` (puerto 4200, modo desarrollo). Ese modo desarrollo es pesado (bundle sin comprimir de ~1.7MB, sin optimizar) y es la razón principal por la que todo se sentía lento al navegar.

Ahora el backend sirve directamente el **build de producción** de Angular (minificado, comprimido con gzip, ~88KB de transferencia real en vez de 1.7MB). Ya **no hace falta correr `ng serve`** para uso normal — con levantar el backend alcanza:

- **`/`** → el portafolio, con el mismo diseño de siempre. Los proyectos ahora se cargan desde MongoDB (ya no están quemados): lo que agregues/edites/borres en el dashboard aparece aquí al instante.
- El nav ahora muestra tu nombre cuando hay sesión activa, con un botón **"Panel admin"** si tu cuenta es admin, y un enlace para salir.
- El formulario "Contáctame" guarda los mensajes en MongoDB y aparecen en el dashboard.
- **`/login`**, **`/register`**, **`/recuperar-password`**, **`/restablecer-password`** → accesibles por URL o desde los botones del nav.
- **`/dashboard`** → protegido (solo admins). Tiene un logo "MR" arriba a la izquierda que te devuelve al portafolio, y un botón "Ver portafolio" al lado de tu nombre. Ahí gestionas proyectos y ves los mensajes de contacto.

MongoDB guarda tres colecciones: `usuarios`, `proyectos` y `mensajes`.

## Ruta exacta para ejecutar y probar todo

### 1. Instalar la dependencia nueva del backend (una sola vez)
```bat
cd "C:\Users\migue\Documents\Proyecto-Mi protafolio\backend"
npm install
```

### 2. Compilar Angular para producción (cada vez que cambie el código de admin-app)
```bat
cd "C:\Users\migue\Documents\Proyecto-Mi protafolio\admin-app"
npx ng build
```
Esto genera `admin-app/dist/admin-app/browser/`, que es lo que el backend sirve. Si no ves cambios reflejados después de una modificación al código, es porque falta correr este paso de nuevo.

### 3. Correr el backend (esto es lo único que necesitas para usar el sitio día a día)
```bat
cd "C:\Users\migue\Documents\Proyecto-Mi protafolio\backend"
npm run dev
```
Debe decir `MongoDB conectado correctamente` y `Servidor backend corriendo en http://localhost:4000`.

### 4. Pruébalo
1. Abre `http://localhost:4000/` → debe verse tu portafolio completo, ahora cargando mucho más rápido.
2. Ve a `http://localhost:4000/register` → crea una cuenta.
3. Ve a `http://localhost:4000/login` → inicia sesión.
   - Si tu cuenta es "usuario", vuelves a la página principal (verás tu nombre en el nav).
   - Si tu cuenta es "admin", puedes entrar a `/dashboard` con el botón "Panel admin".
4. En el dashboard: crea, edita y borra un proyecto de prueba → confirma que aparece en la página principal.
5. Escribe un mensaje desde "Contáctame" en la página principal → confirma que aparece en "Mensajes de contacto" del dashboard.
6. Prueba "¿Olvidaste tu contraseña?" desde el login.
7. Cierra sesión desde el dashboard o desde el nav de la home.
8. En MongoDB Atlas → Browse Collections → confirma `usuarios`, `proyectos` y `mensajes`.

## Notas sobre rendimiento

- El bundle de producción de Angular pesa ~340KB (antes ~1.7MB en modo desarrollo) y viaja comprimido con gzip (~88KB reales).
- El backend usa el middleware `compression` para comprimir todas las respuestas.
- Los archivos estáticos (JS/CSS del build) se sirven con cache de 1 año (`maxAge: '1y'`), así que en visitas repetidas el navegador ni siquiera vuelve a pedirlos.
- Si vuelves a correr `ng build` sin querer y el sitio no arranca, revisa que exista la carpeta `admin-app/dist/admin-app/browser/index.html` — el backend avisa con un mensaje claro si no la encuentra.

## Si tu red vuelve a rechazar la conexión a Mongo

Recuerda: se resolvió usando la "Standard Connection String" de Atlas (no la `mongodb+srv://`) y agregando tu IP en Atlas → Security → Network Access.
