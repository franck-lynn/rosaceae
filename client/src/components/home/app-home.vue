<template>
    <c2-layout>
        <template v-slot:c2-resizable-left>
            <sidebar-index :data=data>

                <template v-slot:logo>
                    <logo></logo>
                </template>

                <template v-slot:sidebar-footer>
                    <sidebar-footer></sidebar-footer>
                </template>

            </sidebar-index>
        </template>

        <template v-slot:c2-resizable-right>
            <r3-layout>
                <template v-slot:header-menu>
                    <r1-layout>
                        <!-- 水平菜单左 -->
                        <template v-slot:r1-left>
                            <goodu></goodu>
                        </template>
                        <!-- 水平菜单右 -->
                        <template v-slot:r1-right>
                            <dropdown-menus></dropdown-menus>
                        </template>

                    </r1-layout>
                </template>


                <!-- 主内容区域的插槽放在这里, 直接插入的是内容 -->
                <template v-slot:main-content>
                    <!-- <vuer-button> app-home.vue 可以添加内容</vuer-button> -->
                    <div>主内容</div>
                    <div>主内容</div>
                    <div>主内容</div>
                    <div>主内容</div>
                    <div>主内容</div>
                    <div>主内容</div>
                    <div>主内容</div>
                    <div>主内容</div>
                    <div>主内容</div>
                    <div>主内容</div>
                    <div>主内容</div>
                    <div>主内容</div>
                    <div>主内容</div>
                    <div>主内容</div>
                    <div>主内容</div>


                    <!-- <dropdown-menus></dropdown-menus>  -->
                </template>


                <template v-slot:footer>
                    <sticky-footer></sticky-footer>
                </template>
            </r3-layout>
        </template>
    </c2-layout>
</template>

<script>
    import data from '../sidebar/sidebar-list.json5'
    // import { useRoute } from 'vue-router' //!!! 取出路由时注意不是 useRoute
    import { defineComponent, onMounted } from 'vue'
    export default defineComponent({
        name: 'app-home',
        props: {},
        setup() {
            // const flag = ref(false)

            onMounted(() => {
                // console.log("02, -----> 加载父")
                // const flagSymbol = Symbol.for('flag')
                // flag.value = true
                // provide(flagSymbol, flag.value)
                // const route = useRoute()
                // console.log("保存在cookies中的token---> ", route)
                // console.log("保存在cookies中的token---> ", route.params)
                // console.log("保存在cookies中的token---> ", route.params.name)
                
            })
            return { data }
        }
    })
</script>

<style lang="scss" scoped>

</style>