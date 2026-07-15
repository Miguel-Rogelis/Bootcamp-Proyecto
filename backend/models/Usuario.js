const mongoose = require('mongoose')

// Schema del usuario para registro/login del panel admin
const usuarioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true // se guarda ya hasheada con bcrypt, nunca en texto plano
    },
    rol: {
        type: String,
        enum: ['admin', 'usuario'],
        default: 'usuario' // el registro publico crea usuarios normales; el admin se asigna a mano en la base
    },
    resetPasswordToken: {
        type: String, // se guarda hasheado (sha256), nunca el token real
        default: null
    },
    resetPasswordExpira: {
        type: Date,
        default: null
    }
}, { timestamps: true }) // agrega createdAt y updatedAt automaticamente

module.exports = mongoose.model('Usuario', usuarioSchema)
