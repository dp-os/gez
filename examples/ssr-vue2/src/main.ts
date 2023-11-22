import './style.css'
import Vue, { reactive, set, del } from 'vue'
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
    proxy: reactive,
    set,
    del
  })
  const app = new Vue({
    provide: {
      [PROVIDE_STORE_KEY]: state
    },
    render (h) {
      return h(App)
    }
  })
  return { app, state }
}
