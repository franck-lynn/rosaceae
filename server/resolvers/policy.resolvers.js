// 角色权限表
import { composeResolvers } from '@graphql-tools/resolvers-composition'
import { isAuthenticated, hasRole } from '../auth'
import { Resource } from '../model/resources'
import { Role } from '../model/role'
import { Policy } from '../model/policy'
import dbCasbin from './utils/casbin-db'

const policyResolver = {
    Mutation: {
        addPolicy: async (root, { roleName, resourceName, act }) => {
            // 设置权限策略表
            // 1. 设置角色时, 客户端传过来的是角色名称, 在角色库里找是什么角色? id 多少?  
            let v0
            try {
                const role = await Role.findOne({ name: roleName })
                v0 = role._id // roleId
            } catch (e) {
                return { msg: '没有找到这个角色, 角色可能没有注册到数据库, 应该先添加这个角色' }
            }
            // 2. 要访问什么资源, 在资源库里找到对应 id, 
            let v1, resource
            try {
                resource = await Resource.findOne({ name: resourceName })
                v1 = resource._id // resourceId
            } catch (e) {
                return { msg: '您请求的资源不存在' }
            }

            // 获取 资源的名称, 如果前面是 Query 或者 Mutation, act 等于这个值
            const operators = resource.name.split('.')

            let operator1 = operators[0].toLowerCase()
            // 如果长度>2, 说明至少有3段, 取最后的一段
            const length = operators.length

            let v2
            if (act) {
                v2 = act
            } else if (operator1 === 'mutation' || operator1 === 'query') {
                v2 = operator1
            } else if (length > 2) {
                v2 = operators[length - 1]
            } else {
                v2 = null
            }
            // 3. 设置权限是查询还是变更? 这是增加角色权限, 不是增加角色
            // 增加之前先查找
            let promission
            try {
                promission = await Policy.findOne({ v0, v1, v2 })
            } catch (e) {
                return { msg: '查询数据库失败' }
            }
            // console.log("查找 promission", promission)
            if (promission) {
                return { isMutationSuccess: false, msg: '已经增加过这个角色权限了, 不用再增加了' }
            } else {
                const res = await (await dbCasbin).addPolicy(v0, v1, v2)
                return { isMutationSuccess: res, msg: '增加角色权限 p 成功' }
            }
        }
    }
}

// 组合认证和授权
const policyResolverComposition = {
    "Query.queryRoles": [isAuthenticated() /*, hasRole() */ ],
    // 'Mutation.insertResources': [isAuthenticated()]
}
// 组合解析器, 变量名是过去式
const composedResolvers = composeResolvers(policyResolver, policyResolverComposition)

export default composedResolvers