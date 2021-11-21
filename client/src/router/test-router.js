// 本文件是专门用于测试的路由, 和正式路由一样, 直接挂载在 app.js 文件的 app 对象上
import path from 'path'
import { files } from '../components/test/load-files'

let testRoutes = []

files.keys().forEach(key => {
    const module = files(key).default
    // console.log("获取的是文件名---> ", path.basename(key, path.extname(key)))
    const filename = path.basename(key, path.extname(key))
    testRoutes = testRoutes.concat({
        path:  filename,
        name: module.name,
        component: module
    })
})


export { testRoutes }