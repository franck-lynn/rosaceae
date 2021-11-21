<template>
    <app-home></app-home>
</template>

<script>
    // import { useRoute } from 'vue-router' //!!! 取出路由时注意不是 useRoute
    import { defineComponent, onMounted } from 'vue'
    export default defineComponent({
        name: 'home',
        props: {},
        setup() {
            onMounted(() => {
                // const route = useRoute()
                // console.log("保存在cookies中的token---> ", route)
                // console.log("保存在cookies中的token---> ", route.params)
                // console.log("保存在cookies中的token---> ", route.params.name)
            })
            return {}
        }
    })
</script>

<style lang="scss">
   #root, body, html{
       height: 100%;
   }
</style>