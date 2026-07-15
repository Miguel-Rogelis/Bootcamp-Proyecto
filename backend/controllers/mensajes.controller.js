const Mensaje = require('../models/Mensaje')

// CREATE — POST /api/mensajes (publico: lo usa el formulario de contacto del portafolio)
async function crear(req, res) {
    try {
        const { nombre, email, asunto, mensaje } = req.body

        if (!nombre || !email || !mensaje) {
            return res.status(400).json({ error: 'nombre, email y mensaje son requeridos' })
        }

        const nuevo = await Mensaje.create({ nombre, email, asunto, mensaje })
        res.status(201).json({ mensaje: 'Mensaje enviado correctamente', datos: nuevo })
    } catch (error) {
        res.status(400).json({ error: 'Error al enviar el mensaje', detalle: error.message })
    }
}

// READ — GET /api/mensajes (protegido: solo admin, se ve en el dashboard)
async function listar(req, res) {
    try {
        // .lean() devuelve objetos JS planos en vez de documentos de Mongoose:
        // mas rapido para un endpoint de solo lectura como este.
        const mensajes = await Mensaje.find().sort({ createdAt: -1 }).lean()
        res.json(mensajes)
    } catch (error) {
        res.status(500).json({ error: 'Error al listar mensajes', detalle: error.message })
    }
}

// UPDATE — PATCH /api/mensajes/:id (marcar como leido/no leido)
async function marcarLeido(req, res) {
    try {
        const editado = await Mensaje.findByIdAndUpdate(
            req.params.id,
            { leido: req.body.leido !== undefined ? req.body.leido : true },
            { new: true }
        )
        if (!editado) return res.status(404).json({ error: 'Mensaje no encontrado' })
        res.json(editado)
    } catch (error) {
        res.status(400).json({ error: 'Error al actualizar el mensaje', detalle: error.message })
    }
}

// DELETE — DELETE /api/mensajes/:id (protegido: solo admin)
async function eliminar(req, res) {
    try {
        const eliminado = await Mensaje.findByIdAndDelete(req.params.id)
        if (!eliminado) return res.status(404).json({ error: 'Mensaje no encontrado' })
        res.json({ mensaje: 'Mensaje eliminado correctamente' })
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el mensaje', detalle: error.message })
    }
}

module.exports = { crear, listar, marcarLeido, eliminar }
