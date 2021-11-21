import Router from '@koa/router'
import { addEndPoint } from '../rest'
// 这个是生成 restful 路由
const restRouter = new Router()

// 这是自动生成的 rest api 路由 
addEndPoint(restRouter)

// 以下是手动的 rest api
// import { typeDefs } from '../graphql'
// import { resolvers } from '../resolvers'
// import { graphql } from 'graphql'
// import { makeExecutableSchema } from '@graphql-tools/schema';
// const schema = makeExecutableSchema({ typeDefs, resolvers })
// restRouter.all('/queryUsers', async (ctx) => {
//     ctx.body = await graphql({
//         schema,
//         source: `{queryUsers{ _id  name email password }}`,
//         variableValues: {}
//     })
// })

export { restRouter }