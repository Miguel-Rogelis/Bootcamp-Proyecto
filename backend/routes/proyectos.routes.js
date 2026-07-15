const express = require('express')
const router = express.Router()
const { crear, listar, obtenerPorId, actualizar, eliminar } = require('../controllers/proyectos.controller')
const verificarToken = require('../middleware/auth.middleware')
const verificarAdmin = require('../middleware/admin.middleware')

// Publicas: cualquiera puede ver los proyectos (el portafolio los consume asi)
router.get('/', listar)
router.get('/:id', obtenerPorId)

// Protegidas: solo un admin logueado (con JWT) puede modificar datos
router.post('/', verificarToken, verificarAdmin, crear)
router.put('/:id', verificarToken, verificarAdmin, actualizar)
router.delete('/:id', verificarToken, verificarAdmin, eliminar)

module.exports = router
