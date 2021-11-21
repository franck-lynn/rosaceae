<template>
    <dropdown-layout :icon="item.icon">
        <template v-slot:dropdown-header>
            <span class="select-language"> {{ t('langs.language') }}</span>
        </template>
        <template v-slot:dropdown-body>
            <ul class="sub-list">
                <li :id="item" v-for="(item, index) in items" :key="index" :class="['info-item', {'sub-item-active': isCurrentTag(currentLocale, item)}]" @click="handleClick">
                    <a href="javascript:void(0)" class="dropdown-toggle info-lang" data-toggle="dropdown">
                        <span :class="`flag-icon flag-icon-small flag-icon-${item}`"></span>
                        <span class="locale-lang"> {{t(`langs.${item}`)}} </span>
                    </a>
                </li>
            </ul>
        </template>
    </dropdown-layout>
</template>

<script>
    import { i18n, SUPPORT_LOCALES, setI18nLanguage, loadLocaleMessages } from '../../../i18n'
    import { useI18n } from 'vue-i18n'
    import { setLocaleValidate } from '../../../validate'
    import { defineComponent, ref, watchEffect } from 'vue'
    import { findParentNode } from '../../helpers'

    export default defineComponent({
        name: 'dropdown-lang',
        props: {},
        setup(props, ctx) {
            const item = {
                icon: 'icon-global'
            }
            const { t, locale } = useI18n({ useScope: 'global' })
            const currentLocale = ref(localStorage.getItem('lang') || locale.value)
            // setI18nLanguage(i18n, currentLocale.value)
            watchEffect(async () => {
                const currentLang = currentLocale.value
                //! 异步加载语言包
                await loadLocaleMessages(i18n, currentLang)
                //! 加载好后再设置语言
                setI18nLanguage(i18n, currentLang)
                localStorage.setItem('lang', currentLang)
                await setLocaleValidate(t) // 设置验证的本地化
            })

            const isActive = ref(false)
            const isShow = ref(false)

            const isCurrentTag = (currentLocale, item) => {
                // 是当前组件, 设置到 localStorge 中去
                return currentLocale ? currentLocale === item : false
            }
            const handleClick = (e) => {
                const el = findParentNode(e.target, 'info-item')
                let langName = process.env.VUE_APP_I18N_LOCALE || 'cn'
                if (el.id) {
                    langName = el.id
                }
                currentLocale.value = langName
                if (el && el.className && el.className === 'info-item') {
                    ctx.emit("infoItemClick", false)
                }
                // let langName = process.env.VUE_APP_I18N_LOCALE || 'cn'
                // e.stopPropagation() // 阻止事件传播
                // e.preventDefault()
                // // 也可以把 :id=item 绑定再 li 标签上, 通过递归函数 findParentNode() 找到
                // // .info-item 类上的 id 确定语言, 这个是绑定在 class="locale-lang" 的 span 标签上的
                // if (e.target.className.includes('locale-lang')) {
                //     langName = e.target.id
                // }
                // if (e.target.className.includes('flag-icon')) {
                //     // 如果点击到在 国旗上, 则找其下一个兄弟节点
                //     langName = e.target.nextElementSibling.id
                // }
                // if (e.target.className.includes('info-lang')) {
                //     // 如果点击到了 a 标签上, 则找最后一个子元素
                //     langName = e.target.lastElementChild.id
                // }
                // currentLocale.value = langName
            }

            return {
                item,
                t,
                locale,
                currentLocale,
                langs: SUPPORT_LOCALES,
                items: SUPPORT_LOCALES,
                isActive,
                isShow,
                isCurrentTag,
                handleClick,
                // dropdown,
            }
        }
    })
</script>

<style lang="scss" scoped>
    // 导入国旗图案
    @import '~flag-icon-css/css/flag-icon.css';
    $icon-font-size: 25px; // 水平导航条图标的宽高字体尺寸
    $height-icon-btn: 45px; // 水平导航条高度
    $width-dropdown-menu: 180px; // 下来菜单的宽度
    $offset-right-icon-btn: 0px; // icon-btn 距离右侧宽度
    $color-dropdown-menu-color: #65cea7;
    $height-dropdown-list: 180px;
    $margin-right: 6px;

    .select-language {
        // 选择语言 字体样式, 原来 title 的命名与 bulma 有冲突
        display: flex;
        align-items: center;
        height: 40px;
        // width: 100%;
        font-size: 0.8rem;
        color: #fff;
        background-color: $color-dropdown-menu-color;
        padding-left: 10px;
    }

    // dropdown-list 下的 sub-list
    .sub-list {
        border: {
            width: 0 1px 1px 1px;
            style: solid;
            color: #ddd;
        }



        >li {
            display: flex;
            flex-direction: column;
            width: 100%;

            &+li {
                border-top: 1px solid #eee; // 分割线
            }

            &.sub-item-active {
                background-color: #f0d2ce; // 激活时的背景色
            }

            .info-lang {
                // font-size: 16px; //信息栏
                font-size: 0.725rem;
                color: #424f63;
                padding: 10px;

                :last-child {
                    // display: flex;
                    padding-left: 6px;
                }

                &:hover {
                    color: $color-dropdown-menu-color;

                    //! 搜索关键词: 悬停提示, css实现了hover显示title的效果
                    //! 哪个元素上设置了 title 属性, 就在哪个类上加 ::after 伪类, 实现悬停的提示
                    // https://blog.csdn.net/qq_41499782/article/details/106827037
                    // https://www.cnblogs.com/horanly/p/6101283.html
                }
            }



            // &:last-child {
            // display: flex;
            // font-size: 14px;
            // justify-content: center;
            // padding-left: 10px;
            // height: 40px;
            // }
        }
    }
</style>