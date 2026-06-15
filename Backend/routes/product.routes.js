import express from 'express'
import {
    getAllProductsAction,
    getProductsByCategoryAction,
    getFilteredProductsAction,
    getMostSoldProductAction,
    updateProductPriceAction
} from '../db/actions/product.actions.js'

const router = express.Router()

// TODOS LOS PRODUCTOS
router.get('/', async (req, res) => {
    try {
        const products = await getAllProductsAction()
        res.status(200).json(products)
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener productos' })
    }
})

// FILTRAR POR QUERY PARAMS
router.get('/filter', async (req, res) => {
    try {
        const { category, minPrice, maxPrice, sortBy } = req.query

        if (minPrice && (!Number.isFinite(Number(minPrice)) || Number(minPrice) < 0)) {
            return res.status(400).json({ message: 'Precio mínimo inválido' })
        }
        if (maxPrice && (!Number.isFinite(Number(maxPrice)) || Number(maxPrice) < 0)) {
            return res.status(400).json({ message: 'Precio máximo inválido' })
        }

        const products = await getFilteredProductsAction({ category, minPrice, maxPrice, sortBy })
        res.status(200).json(products)
    } catch (error) {
        res.status(500).json({ message: 'Error filtrando productos' })
    }
})

// PRODUCTO MÁS VENDIDO
router.get('/most-sold', async (req, res) => {
    try {
        const products = await getMostSoldProductAction()
        res.status(200).json(products)
    } catch (error) {
        res.status(500).json({ message: 'Error obteniendo producto más vendido' })
    }
})

// PRODUCTOS POR CATEGORÍA
router.get('/category/:category', async (req, res) => {
    try {
        const products = await getProductsByCategoryAction(req.params.category)
        res.status(200).json(products)
    } catch (error) {
        res.status(500).json({ message: 'Error al filtrar productos' })
    }
})

// ACTUALIZAR PRECIO
router.put('/price/update/:id', async (req, res) => {
    try {
        const newPrice = Number(req.body.price)

        if (!Number.isFinite(newPrice) || newPrice <= 0) {
            return res.status(400).json({ message: 'Precio inválido' })
        }

        const updated = await updateProductPriceAction(req.params.id, newPrice)
        res.status(200).json({ message: 'Precio actualizado correctamente', product: updated })
    } catch (error) {
        if (error.message === 'NOT_FOUND') {
            return res.status(404).json({ message: 'Producto no encontrado' })
        }
        res.status(500).json({ message: 'Error actualizando precio' })
    }
})

export default router
