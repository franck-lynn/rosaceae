// 判断用户有没有登录
const isAuthenticated = () => (next) => async (root, args, context, info) => {
    console.log("01, 没有找到当前用户----> ", context.currentUser)
    if (!context.currentUser) {
        throw new Error('没有登录, 抛出没有登录异常')
    }else{
        return next(root, args, context, info)
    }
}
export { isAuthenticated }