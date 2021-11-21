// import { users, user_role, roles } from '../db/five-table'
import { Resource } from '../model/resources'
import dbCasbin from '../resolvers/utils/casbin-db'
import { getRoleId } from './utils'
// 判断用户登录后是不是有权限操作, 权限先要在数据库中定义好
const hasRole = () => (next) => async (root, args, context, info) => {
    // 通过上下文中登录的用户查找属于哪个角色
    const roleId = getRoleId(context)
    // 要请求的资源
    const type = String(info.parentType)
    const resource = type + "." + info.fieldName // queryUsers
    // 找资源id, 因为数据库里面存储的是资源id
    const objId = await Resource.findOne({ name: resource })
    // 动作
    const act = type.toLowerCase() // mutation
    // console.log("对资源进行什么操作? ", act)
    // 资源的创建者 createBy: [], 资源的所有者: owner: [], 资源的分享者 sharedTo: []
    // 在 casbin 中, 只存储 用户 -- 角色 映射关系,  和 角色 --- 资源 --- 动作 映射关系
    const res = await (await dbCasbin).enforce(roleId, objId, act)
    // console.log("判断的结果: ", res)
    if (res) {
        return next(root, args, context, info)
    } else {
        throw new Error(`授权没通过, 没有权限!`);
    }
}
export { hasRole }