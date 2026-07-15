const jwt = require('jsonwebtoken')

// Middleware que protege rutas: exige un JWT valido en el header Authorization
function verificarToken(req, res, next) {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No autorizado. Falta el token.' })
    }

    const token = authHeader.split(' ')[1]

    try {
        const datos = jwt.verify(token, process.env.JWT_SECRET)
        req.usuario = datos // { id, email, rol }
        next()
    } catch (error) {
        return res.status(401).json({ error: 'Token invalido o expirado.' })
    }
}

module.exports = verificarToken
