// 初始化响应式变量(登录状态的变量 typeDefs.js 定义的 isLoggedIn )
import Cookies from 'js-cookie'
import { InMemoryCache, makeVar } from '@apollo/client/core'

// 初始化token
const isLoggedInVar = makeVar(Cookies.get('token'))
// 初始化是一个空的数组
const cartItemVar = makeVar([])


const cache = new InMemoryCache({
    typePolicies: {
        Query: {
            fields: {
                isLoggedIn: {
                    read() { return isLoggedInVar() }
                },
                cartItems: {
                    read() { return cartItemVar() }
                }
            }
        }
    }
})

export { isLoggedInVar, cartItemVar, cache }