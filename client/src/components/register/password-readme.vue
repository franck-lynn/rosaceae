<template>
    <span class="password-readme">
        <span class="password-readme-text"> {{$t('register.passwordReadmeText')}} </span>
        <router-link class="password-readme-more" to="/">{{$t('register.passwordReadmeMore')}}</router-link>
    </span>
</template>

<script>
    import { defineComponent } from 'vue'
    export default defineComponent({
        name: 'password-readme',
        props: {},
        setup() {

            return {}
        }
    })
</script>

<style lang="scss" scoped>
    .password-readme {
        display: block;
        width: 100%;
        margin-top: 1rem;
        font-size: 0.8rem;

        // padding-left: 6px;
        .password-readme-more {
            margin-left: 8px;
        }
    }
</style>