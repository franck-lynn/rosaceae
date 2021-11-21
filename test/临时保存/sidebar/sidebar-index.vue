<template>
    <div class="sidebar-header">
        <slot name="logo"></slot>
        <sidebar-list></sidebar-list>
    </div>
    <slot name="sidebar-footer"></slot>
</template>

<script>
    import { defineComponent } from 'vue'
    export default defineComponent({
        name: 'sidebar-index',
        props: {},
        setup() {
            return {}
        }
    })
</script>

<style lang="scss" scoped>

</style>