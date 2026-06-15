import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { connectDB } from './db/connection.js'
import productRoutes from './routes/product.routes.js'
import userRoutes from './routes/user.routes.js'
import saleRoutes from './routes/sale.routes.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.use('/products', productRoutes)
app.use('/users', userRoutes)
app.use('/sales', saleRoutes)

app.get('/', (req, res) => {
    res.send('Servidor ZAMMOT funcionando correctamente')
})

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor levantado en puerto ${PORT}`)
    })
})
