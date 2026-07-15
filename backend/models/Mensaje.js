const mongoose = require('mongoose')

// Schema de los mensajes que llegan desde el formulario "Contáctame" del portafolio
const mensajeSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    asunto: {
        type: String,
        default: '',
        trim: true
    },
    mensaje: {
        type: String,
        required: true
    },
    leido: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

module.exports = mongoose.model('Mensaje', mensajeSchema)
