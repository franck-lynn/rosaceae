import { path2nest } from "../helpers"
import {files} from './load-files'

// 给侧边栏提供数据, test 是路由的前缀
const data = [path2nest(files.keys(), 'test')]

export { data }