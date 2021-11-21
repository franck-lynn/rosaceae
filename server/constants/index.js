// 服务器端读取环境变量
import path from 'path'
import dotenv from 'dotenv'
// F:\working\study\pepper\小辣椒\.env
// F:\working\study\pepper\小辣椒\server\app.js
// auth 是根目录, server是 app所在目录, 从app.js所在目录向上数 到 auth是3个, 就有 3个 /
const envPath = path.resolve(__dirname, '../../.env')
// const env = dotenv.config({ path: envPath }).parsed // 这样是不行的
const SECRET = dotenv.config({ path: envPath }).parsed.SECRET
const PWD = dotenv.config({ path: envPath }).parsed.PWD
const MAIL = dotenv.config({ path: envPath }).parsed.MAIL

// const SECRET = env.SECRET // 这样是不行的
// const PWD = env.PWD // 这样是不行的
// const MAIL = env.MAIL // 这样是不行的

const PORT = dotenv.config({ path: envPath }).parsed.PORT
const CLINET_PORT = dotenv.config({ path: envPath }).parsed.CLINET_PORT
const URL = dotenv.config({ path: envPath }).parsed.URL

const BASEURL = URL + ":" + PORT
const CLIENT_URL = URL + ":" + CLINET_PORT + "/#"

// const PORT = 3000
// const BASEURL = "http://localhost:" + PORT

// const CLINET_PORT = 8080
// const CLIENT_URL = "http://localhost:" + CLINET_PORT + "/#"

export {
    SECRET,
    PWD,
    MAIL,
    PORT,
    BASEURL,
    CLINET_PORT,
    CLIENT_URL
}