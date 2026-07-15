const mongoose = require('mongoose')

// Schema de los proyectos que se muestran en la seccion "Portafolio" del sitio
const proyectoSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true,
        trim: true
    },
    descripcion: {
        type: String,
        required: true
    },
    tecnologias: {
        type: [String],
        default: []
    },
    imagen: {
        type: String,
        default: ''
    },
    enlace: {
        type: String,
        default: ''
    },
    destacado: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

module.exports = mongoose.model('Proyecto', proyectoSchema)
