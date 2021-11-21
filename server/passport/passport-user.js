import { User } from '../model/user'

const getUserByEmail = async (email) => {
    // let user
    // try {
    //     user = await User.findOne({ email })
    // } catch {
    //     throw new Error({ msg: "没有此用户, 需要注册" })
    // }
    // return user
    return await User.findOne({ email })
}

const deleteUser = async (email) => {
    await User.deleteOne({email})
}
export { getUserByEmail, deleteUser }