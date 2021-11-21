import path from 'path'
import dotenv from 'dotenv'

// auth 是根目录, server是 app所在目录, 从app.js所在目录向上数 到 auth是3个, 就有 3个 /
const envPath = path.resolve(__dirname, '../../../.env')

const VUE_APP_I18N_LOCALE = dotenv.config({ path: envPath }).parsed.VUE_APP_I18N_LOCALE


export { VUE_APP_I18N_LOCALE }