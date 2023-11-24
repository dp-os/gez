import './style.css'
import { ref, createSSRApp } from 'vue'
import App from './app.vue'
import { createState, type State } from 'class-state'
import { PROVIDE_STORE_KEY } from './store'

function getInitState (): State {
  // 浏览器获取服务端初始化好的状态
  if (typeof window === 'object') {
    const template = document.getElementById('state')
    if (template) {
      return JSON.parse(template.innerHTML)
    }
  }
  return {
    value: {}
  }
}

export function createApp () {
  const state = createState(ref(getInitState()))
  const app = createSSRApp(App)
  app.provide(PROVIDE_STORE_KEY, state)

  return { app, state }
}
