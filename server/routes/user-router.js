import Router from '@koa/router'
import bcrypt from 'bcryptjs'
import { User } from '../model/user'
import { authenticated, isLogin } from '../passport/passport-initialize'
import { sendMail } from './mailer'
import { BASEURL, SECRET, CLIENT_URL } from '../constants'
import { Base64 } from 'js-base64'
import jwt from 'jsonwebtoken'
import isEmail from 'validator/lib/isEmail'

const userRouter = new Router()


userRouter.use(async (ctx, next) => {
    ctx.state.userEmail = null
    await next()
})


// 登录时 用的是 passport-jwt 和 passport-local
userRouter.post('/login', authenticated)

// 注册时是这个程序单独处理的, 没有用到 passport
userRouter.post('/register', async (ctx) => {
    // 注册的时候, 客户端要传过来用户信息, 通过 ctx.request.body
    const { name, email, password } = ctx.request.body
    console.log('获取注册数据------------> ', name, email)
    // 在数据库里查找
    const hasEmail = await User.findOne({ email })
    if (hasEmail) { // 要用return, 否则继续往下走
        return ctx.body = { msg: '已经注册过了' }
    }
    // 用户状态 status, 创建时间, 修改时间, 
    // 如果没有注册过, 对密码明文进行加密加盐
    const pwd = await bcrypt.hash(password, 12)
    // 生成用户对象
    const user = new User({
        name,
        email,
        password: pwd,
        status: 'pending'
    })
    // 数据库中user 状态是 false, 处于未激活状态, 
    // 并生成一个临时的 get 请求.作为邮件的内容发送给注册者.
    // 当注册者收到这个注册请求后, 进行确认, 此时, 数据库将 status 改为true, 
    // 当在规定的时间内没有收到确认, 则删除本条数据库, 并删除确认路由,
    // 用户必须重新注册
    // https://dev.to/christopherliedtke/how-to-verify-your-users-email-addresses-node-js-express-dg0
    ctx.body = await user.save()
    // 发送邮件
    // 创建链接
    // 在数据库中查找 user, 得到 id
    let theUser = await User.findOne({ email })
    const userId = theUser._id

    // 将加盐的 hash 再签发为一个 token, 并设置过期时间
    const idToken = jwt.sign({ id: userId }, SECRET, { expiresIn: '15m' })
    const html = `${BASEURL}/verify-account/${idToken}` // 拼接一个 url

    console.log("发送邮件的内容--->  ", html)
    // await sendMail(email, html)

    setTimeout(async () => {
        // 约定时间后删除本条数据库
        theUser = await User.findOne({ email })
        if (theUser.status !== 'actived') {
            console.log("约定时间后执行!!!", name, email)
            const result = await User.deleteOne({ name })
            console.log("是不是已经删除", result)
        }

    }, 1000 * 60 * 1);

})
// 解析 token 的函数
// const getUserIdByToken = (token) => {
//     const idTokens = token.split('.')
//     const userId = JSON.parse(Base64.decode(idTokens[1])).id
// }

userRouter.get('/verify-account/:idToken', async (ctx) => {
    const { idToken } = ctx.params
    // 对 userId, secretCode 进行解码和解密, 判断有没有更改过, 
    // 没有 就将数据库中的 状态变更为  actived, 否则, 提示确认失败并删除数据库中这条记录. 
    console.log("请求参数: ", idToken)
    // 解密 idToken, 分3部分, 根据第1部分的参数, 在数据库中找到这个 id, 说明是刚注册的, 
    // const idTokens = idToken.split('.')
    // 再比较 口令部分有没有篡改过, 通过后将数据库状态 改为 actived 激活状态
    // 直接校验  token
    //  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
    // .eyJpZCI6IjVmZGFjODFiMzQxZmRhMmEzOGQxODJiMiIsImlhdCI6MTYwODE3MzU5NSwiZXhwIjoxNjA4MTc0NDk1fQ
    // .F_61mRUxIb80UvZpbGEN1fc43OcZnbqbRfWbD8kCVZ8
    let isTheUser
    try {
        isTheUser = jwt.verify(idToken, SECRET)
    } catch (error) {
        return { msg: "邮箱确认没通过" }
    }

    if (isTheUser) {
        const idTokens = idToken.split('.')
        // 找到数据并更新 status 字段
        const userId = JSON.parse(Base64.decode(idTokens[1])).id
        console.log("token解码出来的id, 要与数据库中进行比较: --> ", userId)
        const updateUserStatus = await User.findByIdAndUpdate(userId, { $set: { status: 'actived' } }, { new: true })
        console.log("更新updateUserStatus---> ", updateUserStatus)
        ctx.body = `<meta http-equiv="refresh" content="3; url=${CLIENT_URL}/#/login"> 注册成功, 3秒后跳转到登录页面, 如果没有跳转, 请收到点击<a href="${CLIENT_URL}/#/login">链接</a>`
    }
})
userRouter.post('/isLogin', isLogin)

userRouter.get('/logout', async ctx => {
    // 后端设置 cookie 失效, 前端删除 cookie, (设置为''时cookie删除了)
    // console.log("检查的请求头", ctx.cookies.get('token'))
    ctx.cookies.set('token', '', { signed: false, maxAge: 0 })
    await ctx.logout()
    // ctx.redirect('/#/index')
    console.log("退出登录")
    ctx.body = { msg: 'logout' } // 没有 body 则客户端会返回 404 错误
})


const passwordReset = async (ctx) => {
    // 没有参数时是提交邮箱, 有参数时是提交新密码
    // post 提交时也可以获取 url 上的参数
    const userToken = ctx.params && ctx.params.token ? ctx.params.token : null
    if (userToken) {
        let isToken
        // token存在是提交新密码进行修改, 要判断这个token是否修改过了
        try {
            isToken = jwt.verify(userToken, SECRET)
        } catch {
            ctx.body = { msg: false }
            return
        }

        // 如果token修改过或者过期了, 返回客户端 false
        if (isToken) {
            // 进行密码修改
            // 修改密码之前看看是不是有 userToken, values=ctx.request.body, 都是有的
            // console.log("修改密码之前看看是不是有 userToken", userToken)
            // console.log("修改密码之前看看是不是有 values", ctx.request.body)
            // isToken 是经过验证的 token, 确认没有被篡改, 根据 isToken 的 _id 找出 user, 写入数据库操作
            // 解析 isToken
            const idTokens = userToken.split('.')
            const userId = JSON.parse(Base64.decode(idTokens[1])).id
            const user = await User.findById(userId)

            // console.log("数据库里查找的用户", user)
            const { password, comfirmPassword } = ctx.request.body
            // 判断密码是不是符合要求
            if (password && comfirmPassword && password === comfirmPassword) {
                console.log("密码", password, comfirmPassword)
                // 对密码进行加盐
                const pwd = await bcrypt.hash(password, 12)
                // 数据库中查找用户并更新
                // 先明文保存
                const updatePassword = await User.findByIdAndUpdate(userId, { $set: { password: pwd } }, { new: true })
                console.log("是否保存进了数据库? ", updatePassword)
                ctx.body = { msg: false, username: updatePassword }
                
                // return
            }
            // 只要令牌是合法的, 就告诉前端, 让前端保持在更改密码的页面
            ctx.body = { msg: true, username: user.name }

        } else {
            ctx.body = { msg: false }
            return
        }
    } else {
        // 如果没有令牌, 就是提交邮箱
        const { email } = ctx.request.body
        if (email && isEmail(email)) {
            // 如果邮箱存在, 并且格式正确, 就在数据库中查找
            const user = await User.findOne({ email })
            if (user) {
                // 如果用户存在, 就生成一个 token, 并把这个token 通过邮件发送给客户
                const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: '15m' })
                const html = `${CLIENT_URL}/password-reset/${token}` // 拼接一个 url
                console.log("发送给用户的数据---> ", html)
                ctx.body = { msg: true }
            }
        }
    }
}


userRouter.all('/password-reset/:token?', passwordReset)

export { userRouter }

// https://www.bilibili.com/video/BV1Qt4y1a7YA?p=112