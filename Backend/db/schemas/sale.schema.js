import mongoose from 'mongoose'

const { Schema, model, models } = mongoose

const SaleSchema = new Schema({
    id_usuario: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    productos:  [{ type: String }],
    total:      { type: Number, required: true },
    direccion:  { type: String, default: 'Dirección pendiente' },
    fecha:      { type: String }
})

const Sale = models.sale || model('sale', SaleSchema)

export default Sale
