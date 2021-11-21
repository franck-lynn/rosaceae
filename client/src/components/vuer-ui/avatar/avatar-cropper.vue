<template>
    <div class="avatar-cropper">
        <div class="avatar-cropper-overlay" :class="{'avatar-cropper-overlay-inline': inline}" v-if="dataUrl">
            <!-- 取消 X 图标  -->
            <div class="avatar-cropper-mark" v-if="!inline">
                <a @click="cancel" class="avatar-cropper-close" :title="labels.cancel" href="javascript:;">&times;</a>
            </div>
            <div class="avatar-cropper-container">
                <div class="avatar-cropper-image-container">
                    <img :src="dataUrl" @load.stop="createCropper" alt ref="img">
       =         </div>
                <div class="avatar-cropper-footer">
                    <button @click.stop.prevent="cancel" class="avatar-cropper-btn">Cancel</button>
                    <button @click.stop.prevent="submit" class="avatar-cropper-btn">Submit</button>
                </div>
            </div>
        </div>
        <input :accept="mimes" class="avatar-cropper-img-input" ref="input" type="file">
    </div>
</template>

<script>
    // https://github.com/overtrue/vue-avatar-cropper/blob/master/src/AvatarCropper.vue
    // 子组件
    import Cropper from 'cropperjs'
    // import 'cropperjs/dist/cropper.css'
    import { defineComponent, onMounted, ref } from 'vue'
    export default defineComponent({
        name: 'avatar-cropper',
        props: {
            trigger: { type: [String, Element], required: true },
            uploadHandler: { type: Function },
            uploadUrl: { type: String },
            requestMethod: { type: String, default: 'POST' },
            uploadHeaders: { type: Object },
            uploadFormName: { type: String, default: 'file' },
            uploadFormData: { type: Object, default () { return {} } },
            cropperOptions: { type: Object, default () { return { aspectRatio: 1, autoCropArea: 1, viewMode: 1, movable: false, zoomable: false } } },
            outputOptions: { type: Object },
            outputMime: { type: String, default: null },
            outputQuality: { type: Number, default: 0.9 },
            mimes: { type: String, default: 'image/png, image/gif, image/jpeg, image/bmp, image/x-icon' },
            labels: { type: Object, default () { return { submit: '提交', cancel: '取消' } } },
            withCredentials: { type: Boolean, default: false },
            inline: { type: Boolean, default: false }
        },
        setup(props, ctx) {
            let cropper = undefined
            const dataUrl = ref()
            const filename = ref()
            let mimeType = null
            const input = ref(null) // input 标签
            const img = ref(null)

            const destroy = () => {
                if (cropper) {
                    cropper.destroy() // ? 
                }
                input.value = ''
                dataUrl.value = undefined
            }

            const uploadImage = () => {
                cropper.getCroppedCanvas(props.outputOptions).toBlob(
                    blob => {
                        let form = new FormData()
                        let xhr = new XMLHttpRequest()
                        let data = Object.assign({}, props.uploadFormData)
                        xhr.withCredentials = props.withCredentials;
                        for (let key in data) {
                            form.append(key, data[key])
                        }
                        form.append(props.uploadFormName, blob, filename.value)
                        ctx.emit('uploading', form, xhr)
                        xhr.open(props.requestMethod, props.uploadUrl, true)
                        for (let header in props.uploadHeaders) {
                            xhr.setRequestHeader(header, props.uploadHeaders[header])
                        }
                        xhr.onreadystatechange = () => {
                            if (xhr.readyState === 4) {
                                let response = ''
                                try {
                                    response = JSON.parse(xhr.responseText)
                                } catch (err) {
                                    response = xhr.responseText
                                }
                                ctx.emit('completed', response, form, xhr)
                                if ([200, 201, 204].indexOf(xhr.status) > -1) {
                                    ctx.emit('uploaded', response, form, xhr)
                                } else {
                                    ctx.emit('error', 'Image upload fail.', 'upload', xhr)
                                }
                            }
                        }
                        xhr.send(form)
                    },
                    props.outputMime,
                    props.outputQuality
                )
            }

            const submit = () => {
                console.log("初始化后转到提交----> ",  props.uploadUrl)
                ctx.emit('submit')
                if (props.uploadUrl) { // 父组件传入了 uploadUrl 时, 用 uploadImage 提交
                    uploadImage()
                } else if (props.uploadHandler) {
                    props.uploadHandler(cropper)
                } else {
                    ctx.emit('error', 'No upload handler found.', 'user')
                }
                // destroy()
            }
            const cancel = () => {
                ctx.emit('cancel')
                destroy();
            }
            const createCropper = () => {
                cropper = new Cropper(img.value, props.cropperOptions) // props.cropperOptions 是cropper的选项参数
            }

            const pickImage = (e) => {
                if(input.value){
                    input.value.click()
                }
                e.preventDefault()
                e.stopPropagation()
            }

            onMounted(() => {
                // listen for click event on trigger
                let trigger = typeof props.trigger == 'object' ? props.trigger : document.querySelector(props.trigger)
                // console.log("获取父组件的button节点--> ", trigger)
                if (!trigger) { // 没有获取到 button 节点
                    ctx.emit('error', 'No avatar make trigger found.', 'user')
                    return
                } else { // 监听 click 事件, 点击 button 选择图片
                    trigger.addEventListener('click', pickImage)
                    // listen for input file changes
                    let fileInput = input.value // 点击后获取 input 对话框
                    if(!fileInput){
                         ctx.emit('error', 'No file be found.', 'user')
                         return
                    }
                    // input 添加 change 事件
                    fileInput.addEventListener('change', () => {
                        // fileInput.files 读取文件后得到的对象数组
                        if (fileInput.files != null && fileInput.files[0] != null) {
                            let correctType = props.mimes.split(', ').find(m => m === fileInput.files[0].type) // 获取支持的文件类型
                            if (!correctType) { // 如果不是支持的文件类型, 给子组件发射一个错误, 并返回
                                ctx.emit('error', 'File type not correct.', 'user');
                                return;
                            }
                            let reader = new FileReader() // 文件读取流
                            reader.onload = e => {
                                // 监听文件加载的事件, 当 dataUrl.value 有值时调用 createCropper 生成 cropper 对象
                                dataUrl.value = e.target.result
                            }
                            reader.readAsDataURL(fileInput.files[0])
                            filename.value = fileInput.files[0].name || 'unknown' // 选择的文件名
                            mimeType = mimeType || fileInput.files[0].type // 文件元类型
                            // 告诉 cropper 已经提交过了
                            ctx.emit('changed', fileInput.files[0], reader)
                        }
                    })
                }
            })
            return { dataUrl, filename, input, img, cancel, createCropper, submit }
        }

    })
</script>

<style lang="scss" scoped>
    @import "~cropperjs/dist/cropper.css";

    .avatar-cropper {
        
        .avatar-cropper-overlay {
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 99999;
        }

        .avatar-cropper-overlay-inline {
            position: initial;
            
        }

        .avatar-cropper-img-input {
            display: none;
        }

        .avatar-cropper-close {
            float: right;
            padding: 20px;
            font-size: 3rem;
            color: #fff;
            font-weight: 100;
            text-shadow: 0px 1px rgba(40, 40, 40, 0.3);
        }

        .avatar-cropper-mark {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.1);
        }

        .avatar-cropper-container {
            background: #fff;
            z-index: 999;
            box-shadow: 1px 1px 5px rgba(100, 100, 100, 0.14);

            .avatar-cropper-image-container {
                position: relative;
                max-width: 400px;
                height: 300px;
            }

            img {
                max-width: 100%;
                height: 100%;
            }

            .avatar-cropper-footer {
                display: flex;
                align-items: stretch;
                align-content: stretch;
                justify-content: space-between;

                .avatar-cropper-btn {
                    width: 50%;
                    padding: 15px 0;
                    cursor: pointer;
                    border: none;
                    background: transparent;
                    outline: none;

                    &:hover {
                        background-color: #2aabd2;
                        color: #fff;
                    }
                }
            }
        }
    }
</style>