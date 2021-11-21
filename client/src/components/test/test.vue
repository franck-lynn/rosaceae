<template>
    <c2-layout>
        <template v-slot:c2-resizable-left>
            <sidebar-index :data=data>
            </sidebar-index>
        </template>

        <template v-slot:c2-resizable-right>
            <div class="test">
                <router-view></router-view>
            </div>

        </template>
    </c2-layout>
</template>

<script>
    // c2-layout.vue 布局分左右2列, 左列可拖拽
    import { data } from '../test/test-data'
    import { defineComponent } from 'vue'
    export default defineComponent({
        name: 'test',
        props: {},
        setup() {

            return { data }
        }
    })
</script>

<style lang="scss" scoped>

    .test {
        height: 100%;
        border: 1px solid red;
    }
</style>