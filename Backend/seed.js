import 'dotenv/config'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import { readFile } from 'fs/promises'
import User from './db/schemas/user.schema.js'
import Product from './db/schemas/product.schema.js'
import Sale from './db/schemas/sale.schema.js'

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('Conectado a MongoDB para seed...')

        // Limpiar colecciones
        await User.deleteMany()
        await Product.deleteMany()
        await Sale.deleteMany()
        console.log('Colecciones limpiadas')

        // Insertar usuarios con contraseñas hasheadas
        const usuariosRaw = JSON.parse(await readFile('./data/usuarios.json', 'utf-8'))
        const usuariosInsertados = []

        for (const u of usuariosRaw) {
            const hashed = await bcrypt.hash(u.password, 10)
            const user = await User.create({
                nombre:    u.nombre,
                apellido:  u.apellido,
                email:     u.email,
                password:  hashed,
                activo:    u.activo,
                direccion: u.direccion || '',
                fechaNac:  u.fechaNac || ''
            })
            usuariosInsertados.push({ oldId: u.id, newId: user._id })
        }
        console.log(`${usuariosInsertados.length} usuarios importados`)

        // Insertar productos con stock inicial
        const productosRaw = JSON.parse(await readFile('./data/products.json', 'utf-8'))
        await Product.insertMany(productosRaw.map(p => ({
            ...p,
            stock: p.disponible !== false ? 10 : 0
        })))
        console.log(`${productosRaw.length} productos importados`)

        // Insertar ventas (mapear id_usuario numérico al nuevo ObjectId)
        const ventasRaw = JSON.parse(await readFile('./data/ventas.json', 'utf-8'))

        for (const v of ventasRaw) {
            const match = usuariosInsertados.find(u => u.oldId === v.id_usuario)
            if (!match) {
                console.warn(`Venta ${v.id}: usuario ${v.id_usuario} no encontrado, se omite`)
                continue
            }
            await Sale.create({
                id_usuario: match.newId,
                productos:  v.productos,
                total:      v.total,
                direccion:  v.direccion,
                fecha:      v.fecha
            })
        }
        console.log(`${ventasRaw.length} ventas importadas`)

        console.log('Seed completado exitosamente')
        process.exit(0)

    } catch (error) {
        console.error('Error en seed:', error.message)
        process.exit(1)
    }
}

seed()
