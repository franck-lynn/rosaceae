// 邮箱验证功能
// https://blog.csdn.net/wu_xianqiang/article/details/108540843

import nodemailer from 'nodemailer'
import { PWD, MAIL } from '../constants'

const transport = nodemailer.createTransport({
    service: '163',
    auth: {
        user: MAIL,
        pass: PWD
    }
})
// 测试发送邮件
// const mailOptions = {
//     from: MAIL,
//     to: 'lry_demry@163.com',
//     cc: "iwill2004@163.com", // 抄送给自己就不会出现 554 错误了, 不然会当成垃圾邮件
//     // bcc: '', // 密送
//     subject: '测试邮箱验证码',
//     html: '这是发送一个随机验证码的邮件</h1>'
// }
// transport.sendMail(mailOptions, (err, info) => {
//     if (err) {
//         console.log(err)
//     } else {
//         console.log("邮件发送" + info.response)
//     }
// })

const sendMail = async (to, html) => {
    const mailOptions = {
        from: MAIL,
        to: to,
        cc: [MAIL, 'lry_demry@163.com'],
        subject: "发送邮箱验证链接",
        html: `<a>${html}</a>`
    }
    try {
        const info = transport.sendMail(mailOptions)
        console.log("邮件发送" + info.response)
    } catch (e) {
        console.log(e)
    }
}

export { sendMail }