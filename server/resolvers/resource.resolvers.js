import { composeResolvers } from '@graphql-tools/resolvers-composition'
import { isAuthenticated, hasRole } from '../auth'
import { typeDefs } from '../graphql'
import { getResource } from './utils/get-resources' 
import { Resource } from '../model/resources'

// const allReaources = getResource(typeDefs.definitions)
/*
 [
     'Policy.role_id',
     'Policy.resource_id',
     'Policy.act_id',
     'Resource.name',
     'Mutation.insertResources',
     'Mutation.addRole',
     'Mutation.addUserRole',
     'Role.name',
     'Query.queryRoles',
     'Query.queryUsers',
     'IsMutationSuccess.isMutationSuccess',
     'IsMutationSuccess.msg',
     'UserRole.user_id',
     'UserRole.role_id',
     'User.name',
     'User.email.isRole',
     'User.password'
 ]
*/

// console.log("打印完整信息: ", util.inspect(typeDefs.definitions, { showHidden: false, depth: null}))
const resourceResolver = {
    Mutation: {
        insertResources: async () => {
            // 把 导入的所有资源存入数据库
            const all = getResource(typeDefs.definitions)
            const resources = all.map(item => ({ name: item }))
            await Resource.insertMany(resources)
            return resources
        },
        removeAllResource: async() => {
            await Resource.deleteMany()
        },
        
    },
    Query: {
        queryResources: async() => await Resource.find()
    }
}
// 组合认证和授权
const resolversComposition = {
    // "Query.queryRoles": [isAuthenticated() /*, hasRole() */ ],
    'Mutation.insertResources': [isAuthenticated()]
}
// 组合解析器, 变量名是过去式
const composedResolvers = composeResolvers(resourceResolver, resolversComposition)

export default composedResolvers