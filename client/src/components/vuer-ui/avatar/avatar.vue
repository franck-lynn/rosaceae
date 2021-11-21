<template>
    <div class="vuer-avatar--wrapper" :style="[style, customStyle]" aria-hidden="true">
        <!-- this img is not displayed; it is used to detect failure-to-load of div background image -->
        <img v-if="isImage" style="display: none" :src="src" @error="onImgError" />
        <span v-show="!isImage">{{ userInitial }}</span>
    </div>
</template>

<script>
    import { computed, defineComponent, onMounted, ref } from 'vue'
    const getInitials = (username) => {
        let parts = username.split(/[ -]/) // 用 空格或者 - 分割字符串
        let initials = ''
        for (let i = 0; i < parts.length; i++) { initials += parts[i].charAt(0) }
        if (initials.length > 3 && initials.search(/[A-Z]/) !== -1) {
            initials = initials.replace(/[a-z]+/g, '')
        }
        initials = initials.substr(0, 3).toUpperCase()
        return initials
    }
    export default defineComponent({
        name: 'vuer-avatar',
        props: {
            username: { type: String }, // 父组件传入
            initials: { type: String },
            backgroundColor: { type: String },
            color: { type: String },
            customStyle: { type: Object },
            inline: { type: Boolean },
            size: { type: Number, default: 50 },
            src: { type: String },
            rounded: { type: Boolean, default: true },
            lighten: { type: Number, default: 80 },
            parser: {
                type: Function,
                default: getInitials,
                validator: (parser) => typeof parser('John', getInitials) === 'string'
            }
        },
        setup(props, ctx) {
            const backgroundColors = ref([
                '#F44336', '#FF4081', '#9C27B0', '#673AB7',
                '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4', '#009688',
                '#4CAF50', '#8BC34A', '#CDDC39', '#FFC107',
                '#FF9800', '#FF5722', '#795548', '#9E9E9E', '#607D8B'
            ])

            const imgError = ref(false)

            onMounted(() => {
                // 通知父组件, ", props.username 和 props.username 首字母大写
                ctx.emit('avatar-initials', props.username, userInitial.value)
            })

            const isImage = computed(() => !imgError.value && Boolean(props.src)) // 图片没有错误并且有图片地址

            const background = () => {
                if (!isImage.value) {
                    return props.backgroundColor || randomBackgroundColor(props.username.length, backgroundColors.value)
                } else {
                    return null
                }
            }
            const fontColor = () => {
                if (!isImage.value) {
                    return props.color || lightenColor(background(), props.lighten)
                } else {
                    return null
                }
            }

            const style = computed(() => {
                const style = {
                    display: props.inline ? 'inline-flex' : 'flex',
                    width: `${props.size}px`,
                    height: `${props.size}px`,
                    borderRadius: props.rounded ? '50%' : 0,
                    lineHeight: `${(props.size + Math.floor(props.size / 20))}px`,
                    fontWeight: 'bold',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    userSelect: 'none'
                }
                const imgBackgroundAndFontStyle = {
                    background: `transparent url('${props.src}') no-repeat scroll 0% 0% / ${props.size}px ${props.size}px content-box border-box`
                }
                const initialBackgroundAndFontStyle = {
                    backgroundColor: background(),
                    font: `${Math.floor(props.size / 2.5)}px/${props.size}px Helvetica, Arial, sans-serif`,
                    color: fontColor(),
                }
                const backgroundAndFontStyle = (isImage.value) ? imgBackgroundAndFontStyle : initialBackgroundAndFontStyle
                Object.assign(style, backgroundAndFontStyle)
                return style
            })

            const userInitial = computed(() => {
                if (!isImage.value) {
                    // 属性解析函数, 解析出首字母, 作为 span 标签中的内容
                    const initials = props.initials || props.parser(props.username, getInitials)
                    return initials
                }
                return ''
            })

            const onImgError = () => {
                // 当图片加载错误时, 例如路径不对, 会触发此错误事件
                imgError.value = true
            }

            function randomBackgroundColor(seed, colors) {
                return colors[seed % (colors.length)]
            }

            function lightenColor(hex, amt) {
                // From https://css-tricks.com/snippets/javascript/lighten-darken-color/
                let usePound = false
                if (hex[0] === '#') {
                    hex = hex.slice(1)
                    usePound = true
                }
                let num = parseInt(hex, 16)
                let r = (num >> 16) + amt
                if (r > 255) r = 255
                else if (r < 0) r = 0
                let b = ((num >> 8) & 0x00FF) + amt
                if (b > 255) b = 255
                else if (b < 0) b = 0
                let g = (num & 0x0000FF) + amt
                if (g > 255) g = 255
                else if (g < 0) g = 0
                return (usePound ? '#' : '') + (g | (b << 8) | (r << 16)).toString(16)
            }

            return {
                backgroundColors,
                imgError,
                background,
                fontColor,
                isImage,
                style,
                userInitial,
                onImgError
            }
        }
    })
</script>

<style lang="scss" scoped>

</style>