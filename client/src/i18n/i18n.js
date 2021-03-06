import { nextTick } from 'vue'
import { createI18n } from 'vue-i18n'
import { supportLocales } from './helper'

// import { setLocale } from 'yup'
// import JSON5 from 'json5'

// export const SUPPORT_LOCALES = ['ja', 'en']
// 导出所有支持的语言 supportLocales() 函数会检查 locales 文件夹下所有
// 的 json5 文件, 获取文件名后构造一个数组, 这个数组就是支持的语言, 
// 但是并没有导入这些文件, 只是计算了支持语言这个过程, 导入是采用懒加载, 需要的时候才导入的
export const SUPPORT_LOCALES = supportLocales()

// i18n/index.js 调用这个进行语言的初始化
export function setupI18n(options = { locale: 'cn' }) {
    // 浏览器刷新的时会重置 i18n 初始化实例
    let i18n = createI18n(options)
    setI18nLanguage(i18n, options.locale)
    return i18n
}
// 切换语言
export function setI18nLanguage(i18n, locale) {
    if (i18n.mode === 'legacy') {
        i18n.global.locale = locale
    } else {
        i18n.global.locale.value = locale
    }
    // 设置 <html lang="对应的语言">...</html>
    document.querySelector('html').setAttribute('lang', locale)
}
// components\locale-changer\locale-changer.vue 切换语言前调用了这个函数进行翻译包的加载
export async function loadLocaleMessages(i18n, locale) {
    // load locale messages with dynami import
    const messages = await import(
        /* webpackChunkName: "locale-[request]" */
        `../locales/${locale}.json5`
    )
    // set locale and locale message
    i18n.global.setLocaleMessage(locale, messages.default)

    return nextTick()
}