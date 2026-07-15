const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Usuario = require('../models/Usuario')

// POST /api/auth/register — crea un usuario nuevo con password hasheada
async function registrar(req, res) {
    try {
        const { nombre, email, password } = req.body

        if (!nombre || !email || !password) {
            return res.status(400).json({ error: 'nombre, email y password son requeridos' })
        }

        const existente = await Usuario.findOne({ email })
        if (existente) {
            return res.status(409).json({ error: 'Ya existe un usuario con ese email' })
        }

        const salt = await bcrypt.genSalt(10)
        const passwordHash = await bcrypt.hash(password, salt)

        const usuario = await Usuario.create({ nombre, email, password: passwordHash })

        res.status(201).json({
            mensaje: 'Usuario registrado correctamente',
            usuario: { id: usuario._id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol }
        })
    } catch (error) {
        res.status(500).json({ error: 'Error al registrar usuario', detalle: error.message })
    }
}

// POST /api/auth/login — valida credenciales y devuelve un JWT
async function login(req, res) {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ error: 'email y password son requeridos' })
        }

        const usuario = await Usuario.findOne({ email })
        if (!usuario) {
            return res.status(401).json({ error: 'Credenciales invalidas' })
        }

        const coincide = await bcrypt.compare(password, usuario.password)
        if (!coincide) {
            return res.status(401).json({ error: 'Credenciales invalidas' })
        }

        const token = jwt.sign(
            { id: usuario._id, email: usuario.email, rol: usuario.rol },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '2h' }
        )

        res.json({
            mensaje: 'Login exitoso',
            token,
            usuario: { id: usuario._id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol }
        })
    } catch (error) {
        res.status(500).json({ error: 'Error al iniciar sesion', detalle: error.message })
    }
}

// GET /api/auth/perfil — ruta protegida de ejemplo, devuelve el usuario del token
async function perfil(req, res) {
    try {
        const usuario = await Usuario.findById(req.usuario.id).select('-password')
        if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' })
        res.json(usuario)
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener perfil', detalle: error.message })
    }
}

// POST /api/auth/forgot-password — genera un token de recuperacion valido por 15 minutos
async function solicitarRecuperacion(req, res) {
    try {
        const { email } = req.body

        if (!email) {
            return res.status(400).json({ error: 'El email es requerido' })
        }

        const usuario = await Usuario.findOne({ email })

        // Por seguridad no revelamos si el email existe o no en la respuesta
        if (!usuario) {
            return res.json({
                mensaje: 'Si el email existe, se generó un enlace de recuperación.'
            })
        }

        // Token aleatorio: se envía al usuario, pero solo se guarda su hash en la BD
        const tokenSinHash = crypto.randomBytes(32).toString('hex')
        const tokenHasheado = crypto.createHash('sha256').update(tokenSinHash).digest('hex')

        usuario.resetPasswordToken = tokenHasheado
        usuario.resetPasswordExpira = Date.now() + 15 * 60 * 1000 // 15 minutos
        await usuario.save()

        // Nota: todavía no hay un servicio de email (SMTP) configurado en este proyecto.
        // Mientras tanto devolvemos el token directamente en la respuesta para que la
        // interfaz arme el enlace y lo muestre en pantalla. Cuando se configure un correo
        // (ej. Gmail + contraseña de aplicación, o un servicio como Resend), este token
        // se enviaría por email en vez de mostrarse aquí.
        res.json({
            mensaje: 'Se generó un enlace de recuperación (válido 15 minutos).',
            resetToken: tokenSinHash
        })
    } catch (error) {
        res.status(500).json({ error: 'Error al solicitar recuperación', detalle: error.message })
    }
}

// POST /api/auth/reset-password — valida el token y guarda la nueva contraseña
async function restablecerPassword(req, res) {
    try {
        const { token, password } = req.body

        if (!token || !password) {
            return res.status(400).json({ error: 'token y password son requeridos' })
        }
        if (password.length < 6) {
            return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' })
        }

        const tokenHasheado = crypto.createHash('sha256').update(token).digest('hex')

        const usuario = await Usuario.findOne({
            resetPasswordToken: tokenHasheado,
            resetPasswordExpira: { $gt: Date.now() }
        })

        if (!usuario) {
            return res.status(400).json({ error: 'El enlace es inválido o ya expiró. Solicita uno nuevo.' })
        }

        const salt = await bcrypt.genSalt(10)
        usuario.password = await bcrypt.hash(password, salt)
        usuario.resetPasswordToken = null
        usuario.resetPasswordExpira = null
        await usuario.save()

        res.json({ mensaje: 'Contraseña actualizada correctamente. Ya puedes iniciar sesión.' })
    } catch (error) {
        res.status(500).json({ error: 'Error al restablecer contraseña', detalle: error.message })
    }
}

module.exports = { registrar, login, perfil, solicitarRecuperacion, restablecerPassword }
