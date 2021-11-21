import { setLocale } from 'yup'
// https://github.com/jquense/yup/issues/71
// https://github.com/jquense/yup/issues/623
// https://github.com/jquense/yup/issues/618
// https://github.com/jquense/yup/issues/750
// https://github.com/jquense/yup/issues/59
const setLocaleValidate = async (t) => {
    // 这里进行验证语言的国际化
    // 与 vue-i18n 采用同一个文件
    setLocale({
        mixed: {
            default: (values) => {
                return t('v.required', { field: values.path })
            },
            required: (values) => {
                // console.log("传入的字段", values.path)
                return t('v.required', { field: values.path })
            }
        },
        string: {
            email: () => t('v.email')
        },
        number: {
            // min: params => {
            //     console.log("传入的参数是: ", params)
            //     return t('number.min', {min: params.min})
            // },
            min: ({ min }) => {
                console.log("传入的参数", min)
                return t('number.min', { min })
            }
        }
    })
}
export { setLocaleValidate }