import { composeResolvers } from '@graphql-tools/resolvers-composition'
// import { users } from '../db/five-table'
import { isAuthenticated, hasRole } from '../auth'
import { User } from '../model/user'


const userResolver = {
    Query: {
        queryUsers: async () => {
            // return users
            return await User.find()
        },
        queryLoginedUser: async (_, { id }, ctx) => {
            console.log("查询的 ctx 是---> ", ctx.currentUser)
            return await User.findById(ctx.currentUser.id)
        }
    },
}


// 组合认证和授权
const resolversComposition = {
    "Query.queryLoginedUser": [isAuthenticated()],
    // 'Mutation.publishArticle': [isAuthenticated(), hasRole('EDITOR')]
}
// 组合解析器, 变量名是过去式
const composedResolvers = composeResolvers(userResolver, resolversComposition)

// export default userResolver
export default composedResolvers