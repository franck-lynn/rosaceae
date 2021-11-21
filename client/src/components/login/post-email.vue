<template>
    <div class="password-reset">
        <div class="container">
            <login-logo></login-logo>
            <h2> {{$t("passwordReset.title")}} </h2>
            <!-- 当忘记密码时跳转到发送页面 -->
            <span :class="['error', {'error-show': JSON.stringify(errors) !== '{}'}]"> {{errors.email || errors.password}} </span>
            <div class="password-reset-form" v-if="!flag">
                <label for="email_field">
                    {{$t("passwordReset.readme")}}
                </label>

                <form @submit.prevent="onSubmit">

                    <!-- 如果你不想要浏览器默认的保存密码功能，你可以在输入框前边再加一个隐藏的输入框就去掉了该功能 -->
                    <input type="text" style="display:none">
                    <vuer-input id="email_field" name="email" :placeholder="$t('register.email')" v-model="email"></vuer-input>
                    <vuer-button plain type="primary">{{$t("passwordReset.send")}}</vuer-button>
                </form>
            </div>
            <!-- 当发送完密码重置邮件后, 提示用户登录 -->
            <div class="password-reset-info" v-if="flag">
                <p>
                    Check your email for a link to reset your password. If it doesn’t appear within a few minutes, check your spam folder.
                </p>
                <router-link to="/login">Return to sign in </router-link>
            </div>
        </div>
    </div>
</template>

<script>
    // 这是密码重置后提示用户登录的界面, 如果用户已经发送邮件, 在邮件中给一个这个页面的链接
    import { useField, useForm } from 'vee-validate'
    import * as yup from 'yup'
    import { postData } from '../../utils'
    import { defineComponent, ref } from 'vue'
    export default defineComponent({
        name: 'post-email',
        props: {
            hasToken: { type: Boolean, default: false }
        },
        setup() {

            const flag = ref(false)
            const { form, handleSubmit, errors } = useForm({
                validationSchema: yup.object().shape({
                    email: yup.string().email().required(),
                })
            })
            const { value: email } = useField('email', undefined, { form })

            email.value = 'zm@163.com'
            const onSubmit = handleSubmit(async (values) => {
                // 提交给服务器, 让服务器处理后发送邮件给客户端, 这里提交时没有带 token, 所以, 在路由中, 走的是
                // else 通道, 获取的是 value = email
                const res = await postData('/password-reset', values)
                if (res.msg) {
                    flag.value = true
                }
                console.log(res)
            })
            return { flag, onSubmit, email, errors }
        }
    })
</script>

<style lang="scss" scoped>
    .password-reset {
        $border-color: #f97583; // 定义变量
        $background-color: #ffeef0; // 定义变量
        // 父级容器, 代表整个页面
        width: 100%;
        height: 100%;

        .container {
            width: 32rem;
            height: 100%;
            // border: 1px solid red;
            display: flex;
            flex-direction: column;
            // justify-content: center;
            align-items: center;

            .password-reset-form,
            .password-reset-info {
                width: 100%;
                // border: 1px solid blueviolet;
                white-space: normal;
                margin-top: 30px;
                background-color: #F6F8FA;
                padding: 36px;
                border-radius: 0.6rem;

                label,
                p {
                    display: block;
                    // white-space: normal;
                    // margin-bottom: 7px;
                    text-align: left;
                    font-weight: 600;
                    font-size: 1.2rem;
                }

                a {
                    display: flex;
                    width: 100%;
                    margin-top: 2rem;
                    height: 45px;
                    justify-content: center;
                    align-items: center;
                    color: #fff;
                    border-radius: 4px;
                    background-color: #2EA44F;
                    font-size: 1.2rem;

                    &:hover,
                    &:focus {
                        background-color: #2C974B;
                    }
                }
            }

            // 登录 标题
            h2 {
                font-size: 1.75rem;
                margin-top: 1rem;
            }

            // 输入框, 输入框大小在 ui input.vue 里可以调整
            .#{$prefix}input {
                width: 100%;
                margin-top: 1.75rem;
            }

            .error {
                position: absolute;
                border: 1px solid $border-color;
                background-color: $background-color;
                display: flex;
                justify-content: start;
                align-items: center;
                width: 100%;
                height: 45px;
                top: 14.5rem;
                // margin-top: 6px;
                border-radius: 4px;
                padding: 6px;
                visibility: hidden;
                z-index: 2;

                &.error-show {
                    visibility: visible;
                }
            }

            .#{$prefix}button {
                width: 100%;
                margin-top: 2rem;
                color: #fff;
                background-color: #2EA44F;

                &:hover,
                &:focus {
                    background-color: #2C974B;
                }
            }
        }
    }
</style>