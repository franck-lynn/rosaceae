<template>
    <!-- <vuer-avatar username="Hubert-Félix" :size="100" @avatar-initials="avatarInitials"></vuer-avatar>
    <vuer-avatar username="Darth Vader" src="/images/gaoyuanyuan.png" :size="100"></vuer-avatar>
    <vuer-avatar username="Darth Vader" src="/images/gaoyuanyuan.png" :size="200" background-color="#ccc" color="#fff" style=" vertical-align: middle;" :inline="true"></vuer-avatar>  -->
    <vuer-avatar-cropper></vuer-avatar-cropper>

</template>

<script>
    import { defineComponent, } from 'vue'
    export default defineComponent({
        name: 'profile',
        props: {},
        setup() {
            const avatarInitials = (e1, e2) => {
                console.log("接受子组件发射过来的数据", e1, e2)
            }


            
            return {
                avatarInitials,
            }
        }
    })
</script>

<style lang="scss" scoped>
    
</style>