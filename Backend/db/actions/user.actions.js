import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../schemas/user.schema.js'
import Sale from '../schemas/sale.schema.js'

export const loginAction = async (email, password) => {
    const user = await User.findOne({ email })
    if (!user) return null

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) return null

    const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '8h' }
    )

    return { user, token }
}

export const createUserAction = async (userData) => {
    const { nombre, apellido, email, password, activo, direccion, fechaNac } = userData

    const exists = await User.findOne({ email })
    if (exists) throw new Error('EMAIL_TAKEN')

    const hashed = await bcrypt.hash(password, 10)

    const newUser = new User({
        nombre,
        apellido,
        email,
        password: hashed,
        activo: activo ?? true,
        direccion: direccion || '',
        fechaNac: fechaNac || ''
    })

    return await newUser.save()
}

export const updateUserAction = async (id, data) => {
    const user = await User.findByIdAndUpdate(id, data, { returnDocument: 'after' })
    if (!user) throw new Error('NOT_FOUND')
    return user
}

export const deleteUserAction = async (id) => {
    const user = await User.findByIdAndDelete(id)
    if (!user) throw new Error('NOT_FOUND')
    await Sale.deleteMany({ id_usuario: id })
    return user
}
