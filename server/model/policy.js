import { ObjectId } from 'mongodb'
import { model, Schema } from 'mongoose'

const policySchema = new Schema({
    role_id: { type: ObjectId, required: true },
    resource_id: { type: ObjectId, required: true },
    act: { type: String, required: true }
}, { collection: 'casbin_mongo_rule' })

const Policy = model('Policy', policySchema)

export { Policy }