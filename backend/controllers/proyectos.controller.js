const Proyecto = require('../models/Proyecto')

// CRUD completo de proyectos del portafolio.
// Lectura (GET) es publica para que el sitio pueda mostrarlos.
// Crear/editar/borrar requieren estar logueado (ruta protegida con JWT).

// Cache en memoria del listado publico: los proyectos casi no cambian (solo
// cuando el admin edita algo), pero se piden en CADA visita a la pagina
// principal. Guardar la respuesta unos segundos evita ir hasta MongoDB Atlas
// (que tiene latencia de red real) en cada carga, sin arriesgar datos viejos:
// cualquier crear/editar/borrar invalida el cache al instante.
let cacheProyectos = null
let cacheTimestamp = 0
const CACHE_TTL_MS = 5 * 60 * 1000 // 5 minutos (cualquier edicion invalida el cache al instante igual)

function invalidarCache() {
    cacheProyectos = null
}

// Se llama una sola vez, apenas el servidor arranca y Mongo ya esta
// conectado: hace la primera consulta "en frio" (la que tiene la latencia de
// red hacia Atlas) ANTES de que llegue la primera visita real, para que quien
// entre al sitio ya encuentre el cache tibio en vez de esperar esos segundos.
async function precalentarCache() {
    try {
        const proyectos = await Proyecto.find().sort({ createdAt: -1 }).lean()
        cacheProyectos = proyectos
        cacheTimestamp = Date.now()
        console.log(`Cache de proyectos precalentado (${proyectos.length} proyectos).`)
    } catch (error) {
        console.error('No se pudo precalentar el cache de proyectos:', error.message)
    }
}

// CREATE — POST /api/proyectos
async function crear(req, res) {
    try {
        const nuevo = await Proyecto.create(req.body)
        invalidarCache()
        res.status(201).json(nuevo)
    } catch (error) {
        res.status(400).json({ error: 'Error al crear el proyecto', detalle: error.message })
    }
}

// READ — GET /api/proyectos
async function listar(req, res) {
    try {
        const ahora = Date.now()
        if (cacheProyectos && (ahora - cacheTimestamp) < CACHE_TTL_MS) {
            res.set('Cache-Control', 'public, max-age=30')
            return res.json(cacheProyectos)
        }

        // .lean() devuelve objetos JS planos en vez de documentos de Mongoose:
        // se salta el trabajo extra de "hidratar" cada resultado, mas rapido
        // para endpoints de solo lectura como este.
        const proyectos = await Proyecto.find().sort({ createdAt: -1 }).lean()
        cacheProyectos = proyectos
        cacheTimestamp = ahora

        res.set('Cache-Control', 'public, max-age=30')
        res.json(proyectos)
    } catch (error) {
        res.status(500).json({ error: 'Error al listar proyectos', detalle: error.message })
    }
}

// READ ONE — GET /api/proyectos/:id
async function obtenerPorId(req, res) {
    try {
        const proyecto = await Proyecto.findById(req.params.id).lean()
        if (!proyecto) return res.status(404).json({ error: 'Proyecto no encontrado' })
        res.json(proyecto)
    } catch (error) {
        res.status(500).json({ error: 'Error al buscar el proyecto', detalle: error.message })
    }
}

// UPDATE — PUT /api/proyectos/:id
async function actualizar(req, res) {
    try {
        const editado = await Proyecto.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        if (!editado) return res.status(404).json({ error: 'Proyecto no encontrado' })
        invalidarCache()
        res.json(editado)
    } catch (error) {
        res.status(400).json({ error: 'Error al actualizar el proyecto', detalle: error.message })
    }
}

// DELETE — DELETE /api/proyectos/:id
async function eliminar(req, res) {
    try {
        const eliminado = await Proyecto.findByIdAndDelete(req.params.id)
        if (!eliminado) return res.status(404).json({ error: 'Proyecto no encontrado' })
        invalidarCache()
        res.json({ mensaje: 'Proyecto eliminado correctamente' })
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el proyecto', detalle: error.message })
    }
}

module.exports = { crear, listar, obtenerPorId, actualizar, eliminar, precalentarCache }
