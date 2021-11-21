import { model, Schema } from 'mongoose'

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    status: { type: String, default: 'pending' },
    meta: {
        createdAt: { type: Date, default: Date.now() },
        updateAt: { type: Date, default: Date.now() }
    }
})
// https://www.v2ex.com/amp/t/498008
userSchema.pre('save', function(next) {
    if (this.isNew) {
        this.meta.createdAt = this.meta.updateAt = Date.now()
    } else {
        this.meta.updateAt = Date.now()
    }
    next()
})

const User = model('User', userSchema)

export { User }