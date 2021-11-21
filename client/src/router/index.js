import { homeRoutes } from './home-router'
import { testRoutes } from './test-router' //测试路由
import { createRouter, createWebHashHistory } from 'vue-router'
import { i18n, SUPPORT_LOCALES, setI18nLanguage, loadLocaleMessages } from '../i18n'
import { setLocaleValidate } from '../validate'
import Cookies from 'js-cookie'
// import { store } from '../store' // 用localStorge
// import { apolloClient } from '../apollo-client'

// 读取 views 文件夹下的所有文件
// 由于 webpack 无法调用 node 的 fs, 这里采用字符串数组的方式, 是不是可以直接采用 ecmascript 直接操作文件呢?
// 直接操作也是相当的麻烦, 还是采用 require.context()
// 一次导入所有的文件, 导入了所有 .vue 文件
// const files = require.context('@/components/', true, /\.vue$/)

let routes = [{
        path: '/index',
        name: 'index',
        component: () => import('@/components/index.vue'),
        meta: { title: '登录页面' }
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/components/login/login.vue'),
        meta: { title: '登录页面' }
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('@/components/register/register.vue'),
        meta: { title: '注册页面' }
    },
    {
        path: '/password-reset/:token?',
        name: 'passwortReset',
        component: () => import('@/components/login/password-reset.vue'),
        meta: { title: 'forget your password' }
    },
    // {
    //     path: '/change-password/',
    //     name: 'changePassword',
    //     component: () => import('@/components/login/change-password.vue'),
    //     meta: { title: 'change your password' }
    // },
    {
        path: '/logout',
        name: 'logout',
        redirect: '/index'
    },
    {
        path: '/profile',
        name: 'profile',
        component: () => import('@/components/user/profile.vue')
    },
    
    {
        path: '/test',
        name: 'test',
        component: () => import('@/components/test/test.vue'),
        meta: {
            title: "测试路由", // 不需要验证
        },
        children: testRoutes
    }
]
//! 约定:
//? 所有 vue 文件都按照模板的 default 导出
//? 文件名称与 vue 中的 name 属性相同, 这样就可以根据 name 属性 取出文件名
// files 读取的文件作为 app-layout.vue 的子路由
// files.keys().forEach(key => {
//     const module = files(key).default
//     routes = routes.concat({
//         path: '/' + module.name,
//         name: module.name,
//         component:module 
//     })
// })
// https://router.vuejs.org/zh/guide/essentials/nested-routes.html
// 配置一个默认的路由
const defaultRoute = {
    path: '/',
    component: () => import('@/components/index.vue'),
    redirect: '/home', // 利用 redirect 设置默认进入的主页 路由
    meta: { title: '首面' },
    // 这里设置子路由, 在 app-layout.vue 中设置连接
}
const homeRouter = {
    path: '/home',
    component: () => import('@/components/home/home.vue'),
    meta: {
        title: "主页",
        requireAuth: true
    },
    // children: homeRoutes
}

routes.push(defaultRoute)
routes.push(homeRouter)


const router = createRouter({
    history: createWebHashHistory(),
    routes
})

router.beforeEach(async (to, from, next) => {
    // i18n 的全局导航守卫, 在进行路由跳转时进行语言的全局设置
    // 保存在客户端的用户语言信息
    // 之前没有获取到 process.env.VUE_APP_I18N_LOCALE 的值的原因是 webpack.config.js 里没有配置
    const currentLocale = localStorage.getItem('lang') || process.env.VUE_APP_I18N_LOCALE
    // 加载当前语言报, https://vue-i18n-next.intlify.dev/guide/advanced/lazy.html
    if (!SUPPORT_LOCALES.includes(currentLocale) && to.path !== '/index') {
        // 如果是不支持的语言, 就跳转到首页
        return next('/index')
    }
    // 如果没有加载语言信息就加载
    if (!i18n.global.availableLocales.includes(currentLocale)) {
        await loadLocaleMessages(i18n, currentLocale)
    }
    // 设置当前语言
    setI18nLanguage(i18n, currentLocale)
    // console.log("i18n实例上的函数", i18n.global.t)
    await setLocaleValidate(i18n.global.t) // 设置验证的本地化
    return next()
})


// 全局前置守卫, to: 即将进入的目标路由, from 当前导航正要离开的路由
router.beforeEach(async (to, from, next) => {
    // 刚开始进入的是 home 页面, 从 from "/" 进入 "/home" 页面, 
    // 理论上, 可以从任意页面进入 home 页面
    if (to.meta.title) { // 页面的 title
        document.title = to.meta.title
    }
    // 判断该路由是否需要登录权限
    if (to.matched.some(record => record.meta.requireAuth)) {
        // https://www.cnblogs.com/web-record/p/9876916.html
        // https://next.router.vuejs.org/guide/advanced/navigation-guards.html
        // 获取页面的请求头 Authorization  
        // const authorizationHeader = store.state.authorizationHeader
        // localStorage 也可以存储请求头, 写入 token 在登录页面
        // const token = localStorage.token
        const token = Cookies.get('token')
        // console.log("获取token", token)
        // 假设 token 存在了
        if (!token) {
            // localStorage 里没有 token, 不用说, 肯定没登录, 直接要求去 首页
            next({ path: '/index' })
        } else {
            // 有 token, 程序还要判断这个 token 是不是有效
            // 需要把 token 放在请求头里带给服务器, isLogin 是服务端鉴权
            const data = await fetch('/isLogin', {
                method: "POST",
                headers: {
                    // 'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    "Authorization": token
                }
            })
            // 主页是用户要访问的页面, 但是不是谁都可以访问的, 需要进行登录, 
            // 现在, 一般用户打开网页就开始访问主页, 路径就是 to--> '/home', 
            const res = await data.json()
            const msg = res.msg
            if (msg) {
                
                // 如果已经登录, 则判断是不是直接访问的home还是其他页面from过来的
                if (to.path === '/home') {
                    // 如果本来就是访问的 home 页, 就直接该执行就执行
                    next()
                } else {
                    // 如果是从其他页面跳转过来的, 就执行
                    next({ path: '/home' })
                }
            } else {
                // 否则, 就是没登录, 因为走 index 页先看会广告也是好的
                next({ path: '/index' })
            }
        }
    } else {
        // 如果是 to login, 就正常执行, 如果是 to home, 会走上面进行判断
        next()
    }

})

export default router