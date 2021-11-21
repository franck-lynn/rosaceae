// import ApolloClient, {} from 'apollo-client'
// import { createHttpLink } from 'apollo-link-http'
// import { InMemoryCache } from 'apollo-cache-inmemory'

// https://github.com/apollographql/apollo-client/issues/6650
// https://github.com/apollographql/apollo-client/issues/7318
// import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client/core'
import { ApolloClient, createHttpLink } from '@apollo/client/core'
import Cookies from 'js-cookie'
import { setContext } from '@apollo/client/link/context'
// import { typeDefs } from './typeDefs'
import { cache, isLoggedInVar } from './cache' // 改由 cache.js 导出

// const httpLink = createHttpLink({
//     // 你需要在这里使用绝对路径
//     uri: 'http://localhost:3000/graphql',
//     headers: { // 这里带上请求头的 token
//         authorization: Cookies.get('token') || isLoggedInVar()
//     },
//     // typeDefs,
// })
//!!! https://github.com/apollographql/apollo-link/issues/646
//!!! adrianolsk commented on 7 May 2020 回复
//!!! @Ramyapriya24 here is the code I am using. 解决了口令刷新的问题
const asyncAuthLink = setContext(async () => {
    const token = Cookies.get('token')
    return {
        headers: {
            authorization: token
        }
    }
})

const httpLink = createHttpLink({
    // 你需要在这里使用绝对路径
    uri: 'http://localhost:3000/graphql',
    // typeDefs,
})
// 缓存实现
// const cache = new InMemoryCache()
// 创建 apollo 客户端
const apolloClient = new ApolloClient({
    // link: httpLink,
    link: asyncAuthLink.concat(httpLink),
    cache,

})

export { apolloClient }