import Sale from '../schemas/sale.schema.js'
import Product from '../schemas/product.schema.js'

export const createSaleAction = async ({ id_usuario, productos, direccion }) => {
    let total = 0
    const productosFinales = []

    for (const item of productos) {
        const productId = typeof item === 'string' ? item : item.id
        let qty = typeof item === 'string' ? 1 : Math.floor(Number(item.qty))
        if (!Number.isFinite(qty) || qty < 1) qty = 1

        const product = await Product.findOne({ id: productId })
        if (product) {
            if (product.stock < qty) {
                throw new Error('INSUFFICIENT_STOCK')
            }
            total += Number(product.price) * qty
            for (let i = 0; i < qty; i++) {
                productosFinales.push(productId)
            }
        }
    }

    if (productosFinales.length === 0) throw new Error('NO_VALID_PRODUCTS')

    const newSale = new Sale({
        id_usuario,
        productos: productosFinales,
        total,
        direccion: direccion || 'Dirección pendiente',
        fecha: new Date().toISOString().split('T')[0]
    })

    const saved = await newSale.save()

    // Descontar stock por cada unidad comprada
    const unidades = {}
    productosFinales.forEach(id => { unidades[id] = (unidades[id] || 0) + 1 })

    for (const [productId, qty] of Object.entries(unidades)) {
        const updated = await Product.findOneAndUpdate(
            { id: productId },
            { $inc: { stock: -qty } },
            { returnDocument: 'after' }
        )
        if (updated && updated.stock <= 0) {
            await Product.updateOne({ id: productId }, { stock: 0, disponible: false })
        }
    }

    return saved
}

export const getSaleDetailAction = async (id) => {
    const sale = await Sale.findById(id).populate('id_usuario')
    if (!sale) throw new Error('NOT_FOUND')

    const products = await Promise.all(
        sale.productos.map(pid => Product.findOne({ id: pid }))
    )

    const user = sale.id_usuario
    return {
        venta: sale._id,
        cliente: user ? `${user.nombre} ${user.apellido}` : 'Cliente desconocido',
        productos: products.filter(Boolean),
        total: sale.total
    }
}

export const getSalesByUserAction = async (id_usuario) => {
    return await Sale.find({ id_usuario })
}
