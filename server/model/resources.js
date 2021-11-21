// 资源模块的Schema
import { model, Schema } from 'mongoose'
export const Resource = model('Resource', new Schema({
    name: { type: String, required: true }
}))
