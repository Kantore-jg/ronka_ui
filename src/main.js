import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

const pinia = createPinia()
const app = createApp(App)
app.use(pinia)
app.use(router)
app.mount('#app')

// Init theme from localStorage
const theme = localStorage.getItem('ronka_theme')
document.documentElement.setAttribute('data-theme', theme === 'light' ? 'light' : 'dark')
