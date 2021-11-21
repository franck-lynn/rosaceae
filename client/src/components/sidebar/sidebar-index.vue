<template>
    <div class="sidebar-header">
        <slot name="logo"></slot>
        <sidebar-list :data=data></sidebar-list>
    </div>
    <slot name="sidebar-footer"></slot>
</template>

<script>
    import { defineComponent } from 'vue'
    export default defineComponent({
        name: 'sidebar-index',
        props: {data: Array, default: () => []},
        setup() {
            return {}
        }
    })
</script>

<style lang="scss" scoped>

</style>