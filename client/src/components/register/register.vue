<template>

    <div class="page-production">
        <router-link to="/index" class="login"> {{$t("index.index")}} </router-link>
        <router-link to="/login" class="login"> {{$t("index.login")}} </router-link>
        <locale-changer></locale-changer>
    </div>

    <div class="register">
        <div class="container">
            <div class="header header-logged-out" role="banner">
                <div class="clearfix width-full text-center">
                    <span> {{$t('register.join')}} </span>
                    <h2>{{$t('register.title')}}</h2>
                </div>
            </div>
            <form @submit.prevent="onSubmit">
                <dl class="form-group my-3 required errored">
                    <dd>
                        <!-- 键盘输入允许小写和数字 -->
                        <vuer-input name="name" :placeholder="$t('register.name')" v-model="name" @keyup="name=name.replace(/[^a-z0-9_]/g,'')"></vuer-input>
                    </dd>
                    <dd id="input-check-name" class="error" v-if="nameError">
                        <span class="mb">{{ nameError }}</span>
                    </dd>
                </dl>
                <dl class="form-group my-3 required errored">
                    <dd>
                        <!-- 邮箱采用小写输入 -->
                        <vuer-input name="email" :placeholder="$t('register.email')" v-model="email" @keyup="email=email.replace(/[^\a-\z\A-\Z0-9\@\.\_\-]/g,'')"></vuer-input>
                    </dd>
                    <!-- onbeforepaste https://blog.csdn.net/badao_liumang_qizhi/article/details/96430699 -->
                    <!-- @beforepaste="clipboardData.setData('text',clipboardData.getData('text').replace(/[^a-zA-Z]/g,''))" -->

                    <dd id="input-check-name" class="error" v-if="emailError">
                        <span class="mb">{{ emailError }}</span>
                    </dd>
                </dl>
                <dl class="form-group my-3 required errored">
                    <dd>
                        <!-- 输入框禁止使用输入法 https://majing.io/questions/320 -->
                        <vuer-input name="password" type="password" :placeholder="$t('register.password')" v-model="password" showPassword @keyup="handleKeyup"></vuer-input>
                    </dd>
                    <dd id="input-check-name" class="error" v-if="passwordError">
                        <span class="mb">{{ passwordError }}</span>
                    </dd>
                </dl>
                
                <password-readme></password-readme>
                
                <vuer-button plain type="primary" @click="onSubmit">{{$t('register.createAccount')}} </vuer-button>
            </form>
        </div>
    </div>

    <vuer-dialog v-if="showMsg" :title="title" v-model="showMsg" :width="width">
        <template v-slot>
            {{msg.msg}}
        </template>
    </vuer-dialog>

</template>

<script>
    import { postData } from '../../utils'
    //! https://logaretm.com/blog/2020-05-06-the-case-for-hoc-vs-composition-api/
    import { useField, useForm } from 'vee-validate'
    import { object, string } from 'yup';
    // import { useI18n } from 'vue-i18n'
    import { defineComponent, ref } from 'vue'
    export default defineComponent({
        name: 'register',
        props: {},
        setup() {
            // const { t } = useI18n()
            const title = "服务器端返回的信息:"
            const width = 400 + 'px'
            const showMsg = ref()
            const msg = ref()
            // 验证部分
            //! 这是使用 schema 的情况, schema 是所有字段验证的集合, 指定那个 form 表单需要验证
            const { form, handleSubmit } = useForm({
                validationSchema: object({
                    name: string().required(),
                    email: string().required().email(),
                    // /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,15}$/
                    password: string().required().min(3),
                })
            });
            //! useField() 方法使用了这个 form, 指定这些字段是属于哪个 form
            //! schema 还是需要定义的
            const { value: name, errorMessage: nameError } = useField('name', undefined, { form })
            const { value: email, errorMessage: emailError } = useField('email', undefined, { form })
            const { value: password, errorMessage: passwordError } = useField('password', undefined, { form })

            name.value = '周芷若'
            email.value = 'zzr@163.com'
            password.value = '123456'
            //! 如果点击提交事件不能触发, 则应该是 locale-chenger.vue 里的取消菜单事件阻止了冒泡
            const onSubmit = handleSubmit(async (values) => {
                // alert(JSON.stringify(values, null, 2))
                msg.value = await postData('/register', values)
                showMsg.value = msg ? true : false
            })

            const handleKeyup = (e) => {
                // 从键盘控制 密码框只能输入 acsii 字符
                let str = e.target.value
                let temp = ''
                for (let i = 0; i < str.length; i++) {
                    if (str.charCodeAt(i) > 0 && str.charCodeAt(i) < 255)
                        temp += str.charAt(i)
                }
                return e.target.value = temp
            }
            return {
                onSubmit,
                name,
                nameError,
                email,
                emailError,
                password,
                passwordError,
                handleKeyup,
                title,
                width,
                showMsg,
                msg
            }
        }
    })
</script>

<style lang="scss" scoped>
    // ========最顶端水平菜单栏, 与index页面相同的css, 开始 =======
    .page-production {
        display: flex;
        background-color: #eee;
        justify-content: flex-end;
        // justify-content: center;
        align-items: center;
    }

    .login {
        margin-right: 0.5rem;
    }

    // ========最顶端水平菜单栏, 与index页面相同的css, 结束 =======
    .register {
        // 父级容器, 代表整个页面
        width: 100%;
        // height: 100%;

        .container {
            width: 24rem;
            // height: 100vh;
            // border: 1px solid red;
            display: flex;
            flex-direction: column;
            // justify-content: center;
            align-items: center;

            // 注册 标题
            h2 {
                font-size: 1.75rem;
                // margin-top: 1rem;
            }

            // svg person 图标
            .header {
                display: flex;
                justify-content: center;
                width: 100%;
                margin-top: 6rem;
            }

            // 输入框, 输入框大小在 ui input.vue 里可以调整
            .form-group {
                // border: 1px solid red;
                position: relative;
                display: block;

                // margin-top: 1.75rem;
                // padding-bottom: 1.75rem;
                .#{$prefix}input {
                    width: 100%;
                }

                .error {
                    $little-triangle-width: 6px; // 定义变量
                    $border-color: #f97583; // 定义变量
                    $background-color: #ffeef0; // 定义变量
                    $little-triangle-left: 6px;

                    border: 1px solid $border-color;
                    border-radius: 5px;
                    margin-top: 6px;
                    padding: 6px;
                    width: 100%;
                    background-color: $background-color;
                    position: absolute;
                    z-index: 20;


                    &::before {
                        content: ''; // 向上的小三角符号
                        width: 0;
                        height: 0;
                        font-size: 0;
                        line-height: 0;
                        border-width: $little-triangle-width;
                        border-style: dashed dashed solid dashed;
                        border-color: transparent transparent $border-color transparent;
                        position: absolute;
                        left: $little-triangle-left;
                        top: - 2 * $little-triangle-width;
                    }

                    &::after {
                        content: ''; // 向上的小三角符号
                        width: 0;
                        height: 0;
                        font-size: 0;
                        line-height: 0;
                        border-width: $little-triangle-width - 1px;
                        border-style: dashed dashed solid dashed;
                        border-color: transparent transparent $background-color transparent;
                        position: absolute;
                        top: - 2 * $little-triangle-width + 2.4px; // 三角形边长的开方
                        left: $little-triangle-left + 1px;
                    }
                }
            }


            .#{$prefix}button {
                width: 100%;
                margin-top: 1rem;
            }


        }
    }
</style>