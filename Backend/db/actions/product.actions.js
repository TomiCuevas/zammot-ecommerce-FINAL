import Product from '../schemas/product.schema.js'
import Sale from '../schemas/sale.schema.js'

export const getAllProductsAction = async () => {
    return await Product.find()
}

export const getProductsByCategoryAction = async (category) => {
    return await Product.find({ category })
}

export const getFilteredProductsAction = async ({ category, minPrice, maxPrice, sortBy }) => {
    const query = {}
    if (category && category !== 'all') query.category = category
    if (minPrice !== undefined && minPrice !== '') query.price = { ...query.price, $gte: Number(minPrice) }
    if (maxPrice !== undefined && maxPrice !== '') query.price = { ...query.price, $lte: Number(maxPrice) }

    let sort = {}
    if (sortBy === 'price_asc')  sort = { price:  1 }
    if (sortBy === 'price_desc') sort = { price: -1 }
    if (sortBy === 'name_asc')   sort = { title:  1 }

    return await Product.find(query).sort(sort)
}

export const getMostSoldProductAction = async () => {
    const sales = await Sale.find()

    const counter = {}
    sales.forEach(sale => {
        sale.productos.forEach(id => {
            counter[id] = (counter[id] || 0) + 1
        })
    })

    const soldValues = Object.values(counter)
    if (soldValues.length === 0) return []

    const maxSold = Math.max(...soldValues)
    const mostSoldIds = Object.keys(counter).filter(id => counter[id] === maxSold)

    return await Product.find({ id: { $in: mostSoldIds } })
}

export const updateProductPriceAction = async (productId, newPrice) => {
    const product = await Product.findOne({ id: productId })
    if (!product) throw new Error('NOT_FOUND')

    await Product.updateOne({ id: productId }, { price: newPrice })

    // Recalcular totales de ventas existentes
    const sales = await Sale.find()
    for (const sale of sales) {
        let newTotal = 0
        for (const pId of sale.productos) {
            const p = await Product.findOne({ id: pId })
            if (p) newTotal += p.price
        }
        sale.total = newTotal
        await sale.save()
    }

    return await Product.findOne({ id: productId })
}
