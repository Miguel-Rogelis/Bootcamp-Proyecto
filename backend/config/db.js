const mongoose = require('mongoose')

// Conecta a MongoDB usando la URI definida en el .env
// Devuelve true/false segun si la conexion se logro, para que quien la llame
// (server.js) pueda precalentar el cache solo si de verdad quedo conectado.
async function conectarDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('MongoDB conectado correctamente')
        return true
    } catch (error) {
        // No se mata el proceso: el portafolio estatico y /api/health siguen
        // funcionando aunque Mongo este caido; las rutas que dependen de la
        // base simplemente devolveran error hasta que la conexion se logre.
        console.error('Error al conectar a MongoDB:', error.message)
        return false
    }
}

module.exports = conectarDB
