// Middleware que exige rol "admin". Debe usarse SIEMPRE despues de verificarToken,
// porque depende de que req.usuario ya haya sido llenado con los datos del JWT.
function verificarAdmin(req, res, next) {
    if (!req.usuario || req.usuario.rol !== 'admin') {
        return res.status(403).json({ error: 'No tienes permisos de administrador para esta accion.' })
    }
    next()
}

module.exports = verificarAdmin
