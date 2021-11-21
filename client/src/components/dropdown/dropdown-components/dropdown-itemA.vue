<template>
    <dropdown-layout :icon="item.icon" :badge="item.badge">
        <template v-slot:dropdown-header>
            <span class="dropdown-header">合同状态</span>
        </template>
        <template v-slot:dropdown-body>
            <ul class="sub-list">
                <li class="info-item" v-for="(item, index) in data" :key="index" @click="handleClick">
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
    import { findParentNode } from '../../helpers'
    import { defineComponent, ref } from 'vue'
    export default defineComponent({
        components: {},
        name: 'dropdown-itemA',
        props: {

        },
        setup(props, ctx) {
            const item = {
                icon: 'icon-xiangmu1',
                badge: 8,
            }
            const data = ref([
                { href: '#', icon: 'icon-cogs', title: '合同状态列表A' },
                { href: '#', icon: 'icon-cogs', title: '合同状态列表C' },
                { href: '#', icon: 'icon-cogs', title: '合同状态列表C' },
            ])
            const handleClick = e => {
                // console.log("dropdown-profile.vue 文件中的点击---> ", e.target)
                // 找到点击这个节点的父节点, 确定是点击了 li 标签或li标签的子节点
                const el = findParentNode(e.target, 'info-item')
                // console.log("dropdown-profile.vue寻找点击的 li 节点--->", el)
                // 告诉父组件 dropdown-menus 子组件点击了 li 节点
                if (el && el.className && el.className === 'info-item') {
                    ctx.emit("infoItemClick", false)
                }
            }
            return { handleClick, item, data }
        }
    })
</script>

<style lang="scss" scoped>
    $color-dropdown-menu-color: #65cea7;
    $background-color-current-button: #424f63; // 图标悬停或者是当前状态时的底色

    .dropdown-header {
        display: flex;
        align-items: center;
        height: 45px;
        font-size: 0.8rem;
        color: #fff;
        background-color: $color-dropdown-menu-color;
        padding-left: 10px;
    }

    ul {
        li {
            padding: 10px;
            font-size: 18px;
            background-color: $color-dropdown-menu-color;

            a {
                 color: #fff;
                .info-title {
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