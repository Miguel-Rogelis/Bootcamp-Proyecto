require('dotenv').config()
const path = require('path')
const fs = require('fs')
const express = require('express')
const cors = require('cors')
const compression = require('compression')
const conectarDB = require('./config/db')

const authRoutes = require('./routes/auth.routes')
const proyectosRoutes = require('./routes/proyectos.routes')
const mensajesRoutes = require('./routes/mensajes.routes')
const { precalentarCache } = require('./controllers/proyectos.controller')

const app = express()

// Middlewares globales
app.use(compression()) // comprime las respuestas (gzip) para que todo cargue mas rapido
app.use(cors())
app.use(express.json())

// Conexion a MongoDB. Una vez conectada, se hace de una vez la primera
// consulta de proyectos (la que tiene la latencia de red hacia Atlas) para
// que el primer visitante ya encuentre el cache tibio en vez de esperarla.
conectarDB().then((conectado) => {
    if (conectado) {
        precalentarCache()
    }
})

// Rutas de la API
app.use('/api/auth', authRoutes)
app.use('/api/proyectos', proyectosRoutes)
app.use('/api/mensajes', mensajesRoutes)

// Ruta de salud, util para probar que el servidor esta vivo
app.get('/api/health', (req, res) => {
    res.json({ ok: true, mensaje: 'API del portafolio funcionando' })
})

// --- Sirve la app de Angular ya compilada (build de produccion) ---
// Antes se corria "ng serve" aparte (modo desarrollo, sin optimizar, ~1.7MB
// sin comprimir) ademas de este backend. Ahora el backend sirve directamente
// el build de produccion (~340KB, minificado) desde un solo servidor: todo
// carga mas rapido y solo hay que levantar este proceso.
const DIST_DIR = path.join(__dirname, '..', 'admin-app', 'dist', 'admin-app', 'browser')
const INDEX_HTML = path.join(DIST_DIR, 'index.html')

if (fs.existsSync(DIST_DIR)) {
    app.use(express.static(DIST_DIR, { maxAge: '1y', index: false }))

    // Fallback: cualquier ruta que no sea de la API ni un archivo estatico
    // (por ejemplo /login, /dashboard, /recuperar-password) debe devolver el
    // index.html para que el router de Angular la resuelva del lado del cliente.
    app.use((req, res) => {
        res.sendFile(INDEX_HTML)
    })
} else {
    app.use((req, res) => {
        res.status(503).send(
            'La app de Angular todavia no esta compilada. Corre "ng build" dentro de admin-app y reinicia el servidor.'
        )
    })
}

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en http://localhost:${PORT}`)
})
