import './style.css'
import Vue, { ref } from 'vue'
import App from './app.vue'
import { type State } from 'class-state'
import { PROVIDE_STORE_KEY } from './store'

function getInitState (): State['value'] {
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
  const state: State = ref(getInitState())
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
