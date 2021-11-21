<template>
    <dropdown-layout :class="['profile-button']" :src="data.src" :username=data.username>
        <template v-slot:dropdown-body>
            <ul class="sub-list">
                <li class="info-item" v-for="(item, index) in items" :key="index" @click="handleClick($event, item)">
                    <router-link class="info-link" :to="item.href">
                        <span v-if="item.icon" :class="['iconfont', item.icon]"> </span>
                        <span class="info-title">{{item.title}} </span>
                    </router-link>
                </li>
            </ul>
        </template>
    </dropdown-layout>
</template>

<script>
    import { apolloClient } from '../../../apollo-client'
    // import { isLoggedInVar } from '../../../apollo-client/cache'

    import gql from 'graphql-tag'

    // https://blog.csdn.net/qq_43574079/article/details/112472724
    import { useRoute } from 'vue-router' //!!! 取出路由时注意不是 useRoute
    import Cookies from 'js-cookie'
    import { findParentNode } from '../../helpers'
    import { defineComponent, onMounted, reactive } from 'vue'
    export default defineComponent({
        name: 'dropdown-profile',
        props: { currentTag: String },
        setup(props, ctx) {
            const items = [
                { href: '/profile', icon: 'icon-cogs', title: 'profile' },
                { href: '#', icon: 'icon-cogs', title: 'Settings' },
                { href: '/logout', icon: 'icon-cogs', title: 'Log Out' },
            ]
            // 从后端获取的静态资源图片, 需要启动服务器
            const data = reactive({
                src: "/images/gaoyuanyuan.png",
                username: "林芮应",
            })
            // const flag = ref(false)
            // const flagSymbol = Symbol.for('flag')


            const handleClick = async (e, item) => {
                // console.log("dropdown-profile.vue 文件中的点击---> ", e.target)
                // 找到点击这个节点的父节点, 确定是点击了 li 标签或li标签的子节点
                const el = findParentNode(e.target, 'info-item')
                // console.log("dropdown-profile.vue寻找点击的 li 节点--->", item.href)
                if (item.href === '/logout') {
                    // 这里做一些清理工作,并向服务器发送信息 并在路由中配置跳转
                    const res = await fetch('/logout')
                    console.log(await res.json())
                }
                // 告诉父组件 dropdown-menus 子组件点击了 li 节点
                if (el && el.className && el.className === 'info-item') {
                    ctx.emit("infoItemClick", false)
                }
            }

            onMounted(async () => {
                // flag.value = inject(flagSymbol) //!!! 要等主程序加载后才加载这个组件
                const route = useRoute()
                const token = await Cookies.get('token')
                console.log("保存在cookies中的token---< ", token)
                // console.log("获取的token---< ", route.params.name)

                //TODO: 路由由 login.vue 组件跳转到 home.vue 时, 由 home.vue 带来的参数
                //TODO: 传给 dropdown-profile.vue 子组件, 
                const user = await apolloClient.query({
                    query: gql `{
                        queryLoginedUser(id: "600fffc5bc8bab18488419f5"){
                            name
                        }
                    }`
                })
                console.log("apollo客户端查询数据库---> ", user.data.queryLoginedUser.name)
                console.log("客户端响应式数据---> ", data.username)
                data.username = user.data.queryLoginedUser.name



                // console.log("2, 这里狠狠打印下 isLoggedInVar 的值, 看看是不是响应式的", isLoggedInVar())
                // if (isLoggedInVar()) {
                //     const user = await apolloClient.query({
                //         query: gql `{
                //             queryLoginedUser(id: "600fffc5bc8bab18488419f5"){
                //                 name
                //             }
                //         }`
                //     })
                //     console.log("apollo客户端查询数据库---> ", user.data.queryLoginedUser.name)
                //     console.log("客户端响应式数据---> ", data.username)
                //     data.username = user.data.queryLoginedUser.name
                // }

            })

            return {
                // flag,
                handleClick,
                items,
                data
            }
        }
    })
</script>

<style lang="scss" scoped>
    $background-color-current-button: #424f63; // 图标悬停或者是当前状态时的底色

    ul {
        // border: 1px solid red;
        display: flex;
        flex-direction: column;
        align-items: center;

        li {
            width: 100%;
            font-size: 18px;

            a {
                color: #fff;
                display: flex;
                padding: 10px;
                align-items: center;
                // border: 1px solid red;

                .info-title {
                    width: 100%;
                    margin-left: 10px;
                }
            }

            &:hover {
                background-color: $background-color-current-button;
            }
        }
    }


    @media screen and (max-width: 768px) and (min-width: 320px) {}
</style>