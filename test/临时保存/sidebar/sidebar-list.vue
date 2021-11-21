<template>
    <div :class="['sidebar-items', {'sidebar-items__actived': currentNode===title }]">
        <sidebar-items v-for="(item, index) in data" :key="index" :items=item :isNarrow=isNarrow :isSidebarActived="currentNode===title" :currentNode=currentNode @isActived=isActived>
        </sidebar-items>
    </div>
</template>

<script>
    // sidebar-list 组件用于展开 sidebar-items 里的每个项目, 在这个组件传入
    // 菜单的数据给 items 
    // {'sidebar-items__active': currentNode===title }
    // 只有有一个一级菜单激活, 则整个 div 就激活
    import { isNarrow } from '../helpers'
    import data from "./sidebar-list.json5";
    import { defineComponent, ref } from 'vue'
    export default defineComponent({
        name: 'sidebar-list',
        props: {},
        setup() {
            const title = ref()
            const currentNode = ref()
            const isActived = e => {
                title.value = e.itemTitle
                if (e.deep === 1) {
                    console.log("deep!=1时也会走这里")
                    if (isNarrow.value) {
                        // 如果是在窄状态下
                        // 就是在宽状态下
                        // currentNode 没有, 或者有但是与当前的点击的不一致
                        if (!currentNode.value || (currentNode.value && currentNode.value !== e.itemTitle)) {
                            currentNode.value = e.itemTitle
                        } else {
                            currentNode.value = null
                        }
                    } else {
                        // 就是在宽状态下
                        // currentNode 没有, 或者有但是与当前的点击的不一致
                        if (!currentNode.value || (currentNode.value && currentNode.value !== e.itemTitle)) {
                            currentNode.value = e.itemTitle
                        } else {
                            currentNode.value = null
                        }
                    }

                } else {
                    currentNode.value = e.el
                }

            }
            return { title, isActived, currentNode, isNarrow, data }
        }
    })
</script>

<style lang="scss" scoped>
    // 这个组件可以不需要样式
</style>