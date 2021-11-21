<template>

    <div class="login">
        <div class="container">
            <login-logo></login-logo>
            <h2> {{$t("login.signin")}} </h2>
            <form @submit.prevent="onSubmit">
                <!-- <span class="error" v-if="JSON.stringify(errors) !== '{}'"> {{errors.email || errors.password}} </span> -->
                <span :class="['error', {'error-show': JSON.stringify(errors) !== '{}'}]"> {{errors.email || errors.password }} </span>
                <span :class="['error', {'error-show': errorMessage}]"> {{errorMessage}} </span>
                <!-- 如果你不想要浏览器默认的保存密码功能，你可以在输入框前边再加一个隐藏的输入框就去掉了该功能 -->
                <input type="text" style="display:none">
                <vuer-input name="email" :placeholder="$t('login.username')" v-model="email"></vuer-input>
                <input type="text" style="display:none">
                <vuer-input name="password" type="password" :placeholder="$t('login.password')" v-model="password" showPassword></vuer-input>
                <dl class="login-password-readme">
                    <dd class="remember-password">
                        <span>{{$t('login.rememberMe')}} </span>
                        <vuer-switch v-model="isRememberPwd"></vuer-switch>
                    </dd>
                    <!-- TODO: 到密码重置页面, 设计密码重置路由 -->
                    <router-link class="forgot" to="/password-reset"><label> {{$t("login.forgot")}} </label></router-link>
                </dl>

                <vuer-button plain type="primary">{{$t("index.login")}}</vuer-button>
            </form>
            <p class="login-callout">
                {{$t("login.notMember")}}
                <router-link to="/register">{{$t("login.createAccount")}}</router-link>
            </p>
        </div>
    </div>
</template>

<script>
    import { encode, decode } from 'js-base64'
    // vue项目实现记住密码功能 https://www.cnblogs.com/mica/p/10879554.html
    import Cookies from 'js-cookie'
    // 为防止恶意注册. 而人机验证需要收费, 拟采用邮箱验证, 超过时间不激活则账户自动
    // 删除的办法. 
    import { useRouter, useRoute } from 'vue-router'
    import { useField, useForm } from 'vee-validate'
    import * as yup from 'yup'
    import { postData } from '../../utils'
    import { isLoggedInVar } from '../../apollo-client/cache'
    import { gql } from '@apollo/client/core'

    import { defineComponent, watchEffect, ref, onMounted } from 'vue'
    // import { apolloClient } from '../../apollo-client'

    export default defineComponent({
        name: 'login',
        props: {},
        setup() {
            const rememberPwdExpires = 7 // 记住密码的过期时间 7 天
            const tokenExpires = 7 // token 的过期时间 7 天
            const router = useRouter() // 本页面有处理路由跳转
            const route = useRoute() // 本页面有处理路由跳转
            const errorMessage = ref()
            const { form, handleSubmit, errors } = useForm({
                validationSchema: yup.object().shape({
                    email: yup.string().email().required(),
                    password: yup.string().min(6).required(),
                })
            })
            // const { value: email, errorMessage: emailError } = useField('email', undefined, { form })
            // const { value: password, errorMessage: passwordError } = useField('password', undefined, { form })
            const { value: email } = useField('email', undefined, { form })
            const { value: password } = useField('password', undefined, { form })

            email.value = 'zm@163.com'
            password.value = 'aaaaaa'
            //! Cookies 里的 false 是字符串, 需要用 JSON.parse 才能转成 布尔值, 不是用 Boolean 来转的
            const isRememberPwd = ref(false)
            //!!! https://juejin.cn/post/6844904182357426190 新版vue-router的hooks用法
            onMounted(() => {
                isRememberPwd.value = Cookies.get('isRememberPwd') ? JSON.parse(Cookies.get('isRememberPwd')) : false
                watchEffect(() => {
                    // 保存这个状态到 cookie
                    Cookies.set('isRememberPwd', isRememberPwd.value, { expires: rememberPwdExpires })
                    // 设置 false 时 会清除密码
                    if (!isRememberPwd.value) {
                        Cookies.remove('email', { path: '' })
                        Cookies.remove('password', { path: '' })
                    }
                })
                if (isRememberPwd.value && Cookies.get('email') && Cookies.get('password')) {
                    email.value = decode(Cookies.get('email'))
                    password.value = decode(Cookies.get('password'))
                }
            })


            const onSubmit = handleSubmit(async (values) => {
                if (isRememberPwd.value) {
                    Cookies.set('email', encode(values.email), { expires: rememberPwdExpires }) // 有效期 7 天
                    Cookies.set('password', encode(values.password), { expires: rememberPwdExpires })
                }

                const res = await postData('/login', values)
                //TODO: 除了提交 restful 请求, 还要提交 apollo 请求
                // const LOGIN_USER = gql`
                //     mutation Login($email: String!, $password: String!){
                //         login(email: $email, password: $password){
                //             id
                //             token
                //         }
                //     }
                // `

                // console.log("除了提交 restful 请求, 还要提交 apollo 请求---> ")
                // const userLogin = await apolloClient.mutate({
                //     mutation: gql `mutation {
                //         login(email: "zm@163.com", password: "aaaaaa"){
                //             token
                //         }
                //     }`
                // })
                // 登录后返回给 graphql 服务器一个 token, 
                // 服务器把这个 token 放在请求头里面
                //TODO: 除了提交 restful 请求, 还要提交 apollo 请求

                if (res.message) {
                    errorMessage.value = res.message
                    return
                }
                if (res.token) {
                    // 只有 token 这一种情况才跳转 home 页, 其余情况都到 登录页
                    // localStorage.setItem('token', 'Bearer ' + res.token)
                    // 改在 Cookies中保存, 设置 expires 属, 否则就是 session 会话期间有效
                    Cookies.set('token', 'Bearer ' + res.token, { expires: tokenExpires })
                    //TODO: 或者在这里才进行 dropdown-profile.vue 组件的加载
                    //TODO: 这里是否可以在 ctx 添加请求头?
                    // console.log("这里狠狠打印下 isLoggedInVar 的值, 看看是不是响应式的", isLoggedInVar(true))
                    isLoggedInVar('Bearer ' + res.token)
                    // console.log(ctx.$router)
                    // 这里实现了3秒后路由的跳转
                    setTimeout(() => {
                        // router.push('/home', {name: 'home', params: {name: values.email}})
                        router.push('/home')
                    }, 1000);
                } else {
                    // console.log(res)
                    // 如果前端拿到状态码为401，就清除token信息并跳转到登录页面
                    // localStorage.removeItem('token')
                    Cookies.remove('token', { path: '' })
                    router.push('/login')
                }
            })
            return { onSubmit, email, password, errors, errorMessage, isRememberPwd }
        }
    })
</script>

<style lang="scss" scoped>
    .login {
        $border-color: #f97583; // 定义变量
        $background-color: #ffeef0; // 定义变量
        // 父级容器, 代表整个页面
        width: 100%;
        height: 100%;

        .container {
            width: 24rem;
            height: 100vh;
            // border: 1px solid red;
            display: flex;
            flex-direction: column;
            // justify-content: center;
            align-items: center;

            // 登录 标题
            h2 {
                font-size: 1.75rem;
                margin-top: 1rem;
            }

            // 输入框, 输入框大小在 ui input.vue 里可以调整
            .#{$prefix}input {
                width: 100%;
                margin-top: 1.75rem;
            }

            .error {
                position: absolute;
                border: 1px solid $border-color;
                background-color: $background-color;
                display: flex;
                justify-content: start;
                align-items: center;
                width: 100%;
                height: 45px;
                top: 14.5rem;
                // margin-top: 6px;
                border-radius: 4px;
                padding: 6px;
                visibility: hidden;
                z-index: 2;

                &.error-show {
                    visibility: visible;
                }
            }

            .login-password-readme {
                display: flex;
                width: 100%;
                height: 45px;
                margin-top: 1rem;
                font-size: 0.8rem;
                justify-content: space-between;
                align-items: center;

                .remember-password {
                    display: flex;
                    justify-items: center;
                    margin: 6px;

                    :last-child {
                        padding-left: 12px;
                        display: flex;
                    }
                }

                .forgot {
                    // display: inline-block;
                    text-align: right;

                    label {
                        cursor: pointer;
                    }
                }
            }

            // 忘记密码 标签


            .#{$prefix}button {
                width: 100%;
                margin-top: 1rem;
            }

            // 没有注册, 注册一个账号 的文字样式
            .login-callout {
                width: 100%;
                margin-top: 1.75rem;
                line-height: 2rem;
                background: #ffffff;
                color: #606266;
                border: 1px solid #dcdfe6;
                padding: 8px 20px;
                font-size: 1rem;
                border-radius: 4px;
                text-align: right;
            }
        }
    }
</style>