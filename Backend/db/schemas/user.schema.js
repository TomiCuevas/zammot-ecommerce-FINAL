import mongoose from 'mongoose'

const { Schema, model, models } = mongoose

const UserSchema = new Schema({
    nombre:    { type: String, required: true },
    apellido:  { type: String, required: true },
    email:     { type: String, required: true, unique: true },
    password:  { type: String, required: true },
    activo:    { type: Boolean, default: true },
    direccion: { type: String, default: '' },
    fechaNac:  { type: String, default: '' }
})

const User = models.user || model('user', UserSchema)

export default User
