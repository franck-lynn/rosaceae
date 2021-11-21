<template>
    <form method="post">
        <div class="vuer-avatar-cropper-demo">
            <div class="vuer-card-body">
                <img :src="user.avatar" class="vuer-card-img avatar" />
                <div class="vuer-card-img-overlay">
                    <button class="pick-avatar-btn" id="pick-avatar">Select an new image</button>
                </div>
                <h5 class="vuer-card-title">{{ user.username }}</h5>
                <div v-if="user.nickname" class="vuer-text-muted">{{ user.nickname }}</div>
            </div>
            <div class="vuer-card-footer"> {{message}} </div>

            <avatar-cropper @uploading="handleUploading" @uploaded="handleUploaded" @completed="handleCompleted" @error="handlerError" trigger="#pick-avatar" :upload-url=uploadUrl />
        </div>
    </form>
</template>

<script>
    import { defineComponent, reactive, ref } from 'vue'
    export default defineComponent({
        name: 'vuer-avatar-cropper',
        props: {},
        setup() {
            // avatar-cropper 的父组件
            // console.log("环境变量中的设置----> ", process.env.BASEURL)
            const uploadUrl = ref(``)
            // const uploadUrl = ref(`${process.env.BASEURL}:${process.env.CLINET_PORT}/upload-file`)
            
            const message = ref('ready')
            const user = reactive({
                nickname: "赵敏",
                username: "无忌老婆",
                avatar: "https://avatars0.githubusercontent.com/u/1472352?s=460&v=4"
            })

            const handleUploading = (from, xhr) => {
                message.value = "uploading..."
            }

            const handleUploaded = (response) => {
                if (response.status == "success") {
                    user.avatar = response.url;
                    // Maybe you need call vuex action to
                    // update user avatar, for example:
                    // this.$dispatch('updateUser', {avatar: response.url})
                    message.value = "user avatar updated.";
                }
            }
            const handleCompleted = (response, form, xhr) => {
                message.value = "upload completed.";
            }
            const handlerError = (message, type, xhr) => {
                message.value = "Oops! Something went wrong...";
            }
            return {
                // avatarInitials,
                uploadUrl,
                message,
                user,
                handleUploading,
                handleUploaded,
                handleCompleted,
                handlerError
            }
        }
    })
</script>

<style lang="scss" scoped>
    $width-card: 18rem;
    $height-card: 20rem;
    $width-card-body: 12.25rem; // 图片宽度为 0.68 * $width-card
    $height-card-body-mt: 1.25rem; // 图片的上边距
    $height-btn: 2.25rem;
    $width-btn: 10rem;

    .#{$prefix}avatar-cropper-demo {
        max-width: $width-card; // 卡片最大宽度
        min-height: $height-card;
        margin: 0 auto; // 卡片居中
        display: flex;
        flex-direction: column;
        background-color: #fff;
        box-shadow: 0 0.5em 1em -0.125em rgb(10 10 10 / 10%), 0 0px 0 1px rgb(10 10 10 / 2%);
        border-radius: 6px;
        // border: 1px solid red;

        .#{$prefix}card-body {
            width: $width-card-body; // 图片 + 文字
            flex: 1 1 auto;
            align-self: center;
            margin-top: $height-card-body-mt;
            // border: 1px solid yellowgreen;
            position: relative;

            .#{$prefix}card-img {
                width: 100%; // 图片大小
                border-radius: 6px;
                // border-radius:50%; // 图片是否是全倒圆?
                display: block;
            }

            .#{$prefix}card-title {
                height: 40px;
                font-size: 2rem;
            }

            .#{$prefix}card-title,
            .#{$prefix}text-muted {
                display: flex;
                justify-content: center;
                margin: 8px;
            }

            .#{$prefix}card-img-overlay {
                display: none; // 图片下方的按钮
                height: $height-btn;
                width: $width-btn;
                transition: all 0.5s;
                position: absolute;
                top: $width-card-body - $height-btn / 1.6; // 稍微偏上一点
                left: ($width-card-body - $width-btn) / 2;


                .pick-avatar-btn {
                    background-color: #0069D9;
                    color: #fff;
                    border: 0;
                    border-radius: 4px;
                    width: 100%;
                    height: 100%;
                }
            }

            &:hover {
                .#{$prefix}card-img-overlay {
                    display: block;
                }
            }
        }

        .#{$prefix}card-footer {
            width: 100%;
            height: 45px;
            line-height: 45px;
            text-align: center;
            background-color: #f9f9f9;
            bottom: 0;
        }
    }
</style>