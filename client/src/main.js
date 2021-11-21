import { createApp } from 'vue'
import App from './App.vue'
// 国际化
import { i18n } from './i18n'
// import { store } from './store'

import router from './router'
import { vuerPlugin } from './components/vuer-plugin'
// import "./validate";

const app = createApp(App)
app.use(i18n)
app.use(router)

// app.use(store)
app.use(vuerPlugin)
app.mount('#root')