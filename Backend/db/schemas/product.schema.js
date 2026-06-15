import mongoose from 'mongoose'

const { Schema, model, models } = mongoose

const ProductSchema = new Schema({
    id:          { type: String, required: true, unique: true },
    title:       { type: String, required: true },
    description: { type: String, required: true },
    price:       { type: Number, required: true },
    img:         { type: String, default: '' },
    category:    { type: String, required: true },
    disponible:  { type: Boolean, default: true },
    stock:       { type: Number, default: 10 }
})

const Product = models.product || model('product', ProductSchema)

export default Product
