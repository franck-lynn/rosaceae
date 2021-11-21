<template>
    <dropdown-layout :icon="item.icon" :badge="item.badge" :currentTag="currentTag">
        <template v-slot:dropdown-header>
            <span class="dropdown-header">采购</span>
        </template>
        <template v-slot:dropdown-body>
            <ul class="sub-list">
                <li class="info-item" @click="handleClick">采购A</li>
                <li class="info-item" @click="handleClick">采购B</li>
                <li class="info-item" @click="handleClick">采购C</li>
            </ul>
        </template>
    </dropdown-layout>
</template>

<script>
    import { findParentNode } from '../../helpers'
    import { defineComponent, ref } from 'vue'
    export default defineComponent({
        components: {},
        name: 'dropdown-itemB',
        props: {},
        setup(props, ctx) {
            const currentTag = ref('dropdown-itemB')
            const item = {
                icon: 'icon-xiangmu1',
                badge: 6,
            }
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
            return { handleClick, currentTag, item }
        }
    })
</script>

<style lang="scss" scoped>
    $color-dropdown-menu-color: #65cea7;

    .dropdown-header {
        display: flex;
        align-items: center;
        height: 45px;
        font-size: 0.725rem;
        color: #fff;
        background-color: $color-dropdown-menu-color;
        padding-left: 10px;
    }

    .sub-list {

        // border: 1px solid #ddd;
        border: {
            width: 0 1px 1px 1px;
            style: solid;
            color: #ddd;
        }

        display: flex;
        flex-direction: column;

        >li {
            // background: #ddd;

            display: flex;
            flex-direction: column;
            width: 100%;
            padding: 8px;

            &+li {
                border-top: 1px solid #eee; // 分割线
            }

            .info-number {

                font-size: 16px; //信息栏
                padding: 10px;

                .task-info {
                    >* {
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                }

                &:hover {
                    color: $color-dropdown-menu-color;

                    //! 搜索关键词: 悬停提示, css实现了hover显示title的效果
                    //! 哪个元素上设置了 title 属性, 就在哪个类上加 ::after 伪类, 实现悬停的提示
                    // https://blog.csdn.net/qq_41499782/article/details/106827037
                    // https://www.cnblogs.com/horanly/p/6101283.html
                }
            }

            .progress {
                height: 80px;
                width: 100%;
                display: flex;
                justify-content: flex-start;
                align-items: center;
                // background-color: greenyellow;
            }

            &:last-child {
                display: flex;
                font-size: 14px;
                justify-content: center;
                padding-left: 10px;
                height: 40px;
            }
        }
    }
</style>