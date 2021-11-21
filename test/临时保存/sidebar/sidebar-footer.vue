<template>
    <div :class="['sidebar-footer', {'narrow': isNarrow}]">
        <sidebar-dock :items=data :isNarrow=isNarrow :currentNode=currentNode @isActived=isActived>
        </sidebar-dock>
    </div>
</template>

<script>
    // 侧边栏页脚, 可以做登录用户的信息和程序设置的菜单
    import { isNarrow } from '../helpers'
    import { defineComponent, ref } from 'vue'
    export default defineComponent({
        name: 'sidebar-footer',
        props: {},
        setup() {
            const currentNode = ref()

            const isActived = e => {
                if (e.deep === 1) {
                    // currentNode 没有, 或者有但是与当前的点击的不一致
                    if (!currentNode.value || (currentNode.value && currentNode.value != e.itemTitle)) {
                        currentNode.value = e.itemTitle
                    } else {
                        currentNode.value = null
                    }
                }else {
                    currentNode.value =e.el
                }
            }
            const data = [
                { title: '页脚1', children: [
                    {title: '没有下级菜单A'}, 
                    {title: '没有下级菜单B'}, 
                ] },
                {
                    title: 'A',
                    children: [
                        { title: '用户管理1', children: [{ title: '子菜单1' }, { title: '子菜单2' }] },
                        { title: '用户管理2' },
                        { title: '用户管理3' },
                        { title: '用户管理4' },
                        { title: '用户管理5' },
                    ]
                }
            ]
            return { isNarrow, isActived, currentNode, data }
        }
    })
</script>

<style lang="scss" scoped>
    // 整个侧边栏的布局样式在 c2-layout.vue 里的 sidenav 类
    $color-separator-line: #aaa9a9;

    .sidebar-footer::before {
        content: ''; //* 分割线, 
        display: block;
        width: 94%;
        border-bottom: 1px solid $color-separator-line;
        align-self: center;
        margin-left: 4px;
    }
</style>