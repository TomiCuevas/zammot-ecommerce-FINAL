import express from 'express'
import {
    loginAction,
    createUserAction,
    updateUserAction,
    deleteUserAction
} from '../db/actions/user.actions.js'

const router = express.Router()

// LOGIN
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: 'Email y contraseña requeridos' })
        }

        const result = await loginAction(email, password)

        if (!result) {
            return res.status(401).json({ message: 'Credenciales inválidas' })
        }

        const { user, token } = result

        res.status(200).json({
            _id: user._id,
            nombre: user.nombre,
            apellido: user.apellido,
            email: user.email,
            activo: user.activo,
            direccion: user.direccion,
            token
        })

    } catch (error) {
        res.status(500).json({ message: 'Error en login' })
    }
})

// CREAR USUARIO
router.post('/create', async (req, res) => {
    try {
        const { nombre, apellido, email, password } = req.body

        if (!nombre || !apellido || !email || !password) {
            return res.status(400).json({ message: 'Faltan datos obligatorios' })
        }

        const newUser = await createUserAction(req.body)

        res.status(201).json({
            message: 'Usuario creado correctamente',
            user: {
                _id: newUser._id,
                nombre: newUser.nombre,
                apellido: newUser.apellido,
                email: newUser.email
            }
        })

    } catch (error) {
        if (error.message === 'EMAIL_TAKEN') {
            return res.status(409).json({ message: 'El email ya está registrado' })
        }
        res.status(500).json({ message: 'Error creando usuario' })
    }
})

// ACTUALIZAR USUARIO
router.put('/update/:id', async (req, res) => {
    try {
        const user = await updateUserAction(req.params.id, req.body)
        res.status(200).json({ message: 'Usuario actualizado correctamente', user })
    } catch (error) {
        if (error.message === 'NOT_FOUND') {
            return res.status(404).json({ message: 'Usuario no encontrado' })
        }
        res.status(500).json({ message: 'Error actualizando usuario' })
    }
})

// ELIMINAR USUARIO Y SUS VENTAS
router.delete('/delete/:id', async (req, res) => {
    try {
        const user = await deleteUserAction(req.params.id)
        res.status(200).json({
            message: 'Usuario y sus ventas eliminados correctamente',
            usuarioEliminado: `${user.nombre} ${user.apellido}`
        })
    } catch (error) {
        if (error.message === 'NOT_FOUND') {
            return res.status(404).json({ message: 'Usuario no encontrado' })
        }
        res.status(500).json({ message: 'Error eliminando usuario' })
    }
})

export default router
