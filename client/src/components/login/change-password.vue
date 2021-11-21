<template>
    <div class="password-reset">
        <div class="container">
            <div class="header header-logged-out" role="banner">
                <div class="clearfix width-full text-center">
                    <router-link to="/index">
                        <!-- Octicons 图标是 github 使用的图标, 与阿里妈妈图标相比, 要简洁很多 -->
                        <!-- https://github.com/primer/octicons -->
                        <!-- https://primer.style/octicons/ -->
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="96" height="96">
                            <path d="M16.75 8.5a1.25 1.25 0 100-2.5 1.25 1.25 0 000 2.5z"></path>
                            <path fill-rule="evenodd" d="M15.75 0a8.25 8.25 0 00-7.851 10.79L.513 18.178A1.75 1.75 0 000 19.414v2.836C0 23.217.784 24 1.75 24h1.5A1.75 1.75 0 005 22.25v-1a.25.25 0 01.25-.25h2.735a.75.75 0 00.545-.22l.214-.213A.875.875 0 009 19.948V18.5a.25.25 0 01.25-.25h1.086c.464 0 .91-.184 1.237-.513l1.636-1.636A8.25 8.25 0 1015.75 0zM9 8.25a6.75 6.75 0 114.288 6.287.75.75 0 00-.804.168l-1.971 1.972a.25.25 0 01-.177.073H9.25A1.75 1.75 0 007.5 18.5v1H5.25a1.75 1.75 0 00-1.75 1.75v1a.25.25 0 01-.25.25h-1.5a.25.25 0 01-.25-.25v-2.836a.25.25 0 01.073-.177l7.722-7.721a.75.75 0 00.168-.804A6.73 6.73 0 019 8.25z"></path>
                        </svg>
                    </router-link>
                </div>
            </div>
            <h2> {{$t("changePassword.title")}}@ {{username}}</h2>
            <!-- 当忘记密码时跳转到发送页面 -->
            <span :class="['error', {'error-show': JSON.stringify(errors) !== '{}'}]"> {{errors}} </span>
            <div class="password-reset-form" v-if="!flag">
                <label for="password_field">
                    {{$t("passwordReset.readme")}}
                </label>

                <form @submit.prevent="onSubmit">

                    <!-- 如果你不想要浏览器默认的保存密码功能，你可以在输入框前边再加一个隐藏的输入框就去掉了该功能 -->
                    <input type="text" style="display:none">
                    <vuer-input id="password_field" name="password" type="password" :placeholder="$t('login.password')" v-model="password">
                    </vuer-input>

                    <input type="text" style="display:none">
                    <vuer-input name="comfirmPassword" type="password" :placeholder="$t('changePassword.comfirmPassword')" v-model="comfirmPassword">
                    </vuer-input>
                    <vuer-button plain type="primary">{{$t("changePassword.changeButton")}}</vuer-button>
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
    <div class="password-reset-info" v-if="flag">
        <p>
            Check your email for a link to reset your password. If it doesn’t appear within a few minutes, check your spam folder.
        </p>
        <router-link to="/login">Return to sign in </router-link>
    </div>
</template>

<script>
    import { postData } from '../../utils'
    //! https://logaretm.com/blog/2020-05-06-the-case-for-hoc-vs-composition-api/
    import { useField, useForm } from 'vee-validate'
    import { object, string } from 'yup';
    // import { useI18n } from 'vue-i18n'
    import { defineComponent, getCurrentInstance, ref } from 'vue'
    export default defineComponent({
        name: 'change-password',
        props: {
            username: { type: String, default: '' }
        },
        setup() {
            const flag = ref(false)
            const { form, handleSubmit, errors } = useForm({
                validationSchema: object({
                    // /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,15}$/
                    password: string().required().min(3),
                })
            });
            const { value: password } = useField('password', undefined, { form })
            const { value: comfirmPassword } = useField('comfirmPassword', undefined, { form })

            // 临时填入表单数据:
            password.value = 'aaaaaa'
            comfirmPassword.value = 'aaaaaa'

            const { ctx } = getCurrentInstance()
            const currentRoute = ctx.$root.$route // 当前的路由 url
            // 当前路由url是否带了口令, 如果带了口令, 说明已经发送过给邮箱链接了
            const currentToken = currentRoute.params && currentRoute.params.token ? currentRoute.params.token : null
            // 获取 参数中的口令
            const onSubmit = handleSubmit(async (values) => {
                // 这里提交不仅仅是 password, 而且还要带上 token, 
                const res = await postData(`/password-reset/${currentToken}`, values)
                // console.log("打印改变密码的数据----> ", res.msg, res.username)
                if (res.username) {
                    flag.value = true
                }
            })


            return {
                flag,
                errors,
                password,
                comfirmPassword,
                onSubmit
            }
        }
    })
</script>

<style lang="scss" scoped>
    // svg key 图标
    .header {
        margin-top: 6rem;

        svg {
            opacity: .5;

            &:hover {
                fill: #203f5f;
            }
        }
    }

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