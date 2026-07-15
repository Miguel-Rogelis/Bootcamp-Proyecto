const express = require('express')
const router = express.Router()
const { crear, listar, marcarLeido, eliminar } = require('../controllers/mensajes.controller')
const verificarToken = require('../middleware/auth.middleware')
const verificarAdmin = require('../middleware/admin.middleware')

// Publica: el formulario "Contáctame" del portafolio manda mensajes sin necesitar sesion
router.post('/', crear)

// Protegidas: solo un admin logueado ve y administra los mensajes (panel admin)
router.get('/', verificarToken, verificarAdmin, listar)
router.patch('/:id', verificarToken, verificarAdmin, marcarLeido)
router.delete('/:id', verificarToken, verificarAdmin, eliminar)

module.exports = router
