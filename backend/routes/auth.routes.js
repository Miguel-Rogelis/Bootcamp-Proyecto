const express = require('express')
const router = express.Router()
const { registrar, login, perfil, solicitarRecuperacion, restablecerPassword } = require('../controllers/auth.controller')
const verificarToken = require('../middleware/auth.middleware')

router.post('/register', registrar)
router.post('/login', login)
router.get('/perfil', verificarToken, perfil) // ejemplo de ruta protegida
router.post('/forgot-password', solicitarRecuperacion)
router.post('/reset-password', restablecerPassword)

module.exports = router
