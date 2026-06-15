import express from 'express'
import { verifyToken } from '../middlewares/verifyToken.js'
import {
    createSaleAction,
    getSaleDetailAction,
    getSalesByUserAction
} from '../db/actions/sale.actions.js'

const router = express.Router()

// CREAR VENTA — requiere JWT
router.post('/create', verifyToken, async (req, res) => {
    try {
        const { productos, direccion } = req.body
        const id_usuario = req.user.id  // viene del token verificado

        if (!productos || !Array.isArray(productos) || productos.length === 0) {
            return res.status(400).json({ message: 'Faltan productos para generar la compra' })
        }

        const sale = await createSaleAction({ id_usuario, productos, direccion })

        res.status(201).json({
            message: 'Compra realizada correctamente',
            sale
        })

    } catch (error) {
        if (error.message === 'NO_VALID_PRODUCTS') {
            return res.status(400).json({ message: 'No se encontraron productos válidos' })
        }
        if (error.message === 'INSUFFICIENT_STOCK') {
            return res.status(400).json({ message: 'Stock insuficiente para uno o más productos del carrito' })
        }
        res.status(500).json({ message: 'Error al generar venta' })
    }
})

// DETALLE DE VENTA
router.get('/detail/:id', async (req, res) => {
    try {
        const detail = await getSaleDetailAction(req.params.id)
        res.status(200).json(detail)
    } catch (error) {
        if (error.message === 'NOT_FOUND') {
            return res.status(404).json({ message: 'Venta no encontrada' })
        }
        res.status(500).json({ message: 'Error obteniendo detalle de venta' })
    }
})

// VENTAS POR USUARIO
router.post('/user', async (req, res) => {
    try {
        const { id_usuario } = req.body

        if (!id_usuario) {
            return res.status(400).json({ message: 'Debe enviar un id_usuario' })
        }

        const sales = await getSalesByUserAction(id_usuario)
        res.status(200).json(sales)
    } catch (error) {
        res.status(500).json({ message: 'Error obteniendo ventas del usuario' })
    }
})

export default router
