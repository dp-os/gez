import './style.css'
import { reactive, createSSRApp } from 'vue'
import App from './app.vue'
import { createState } from 'class-state'
import { PROVIDE_STORE_KEY } from './store'

function getInitState () {
  // 浏览器获取服务端初始化好的状态
  if (typeof window === 'object') {
    const template = document.getElementById('state')
    if (template) {
      return JSON.parse(template.innerHTML)
    }
  }
  return {}
}

export function createApp () {
  const state = createState({
    state: getInitState(),
    proxy: reactive
  })
  const app = createSSRApp(App)
  app.provide(PROVIDE_STORE_KEY, state)

  return { app, state }
}
