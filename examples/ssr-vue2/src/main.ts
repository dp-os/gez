import Vue, { reactive, set, del } from 'vue'
import App from './app.vue'
import { createState } from 'class-state'
import { PROVIDE_STORE_KEY } from './store'

export function createApp () {
  let serverState: Record<string, any> = {}
  if (typeof window === 'object') {
    const template = document.getElementById('state')
    if (template) {
      serverState = JSON.parse(template.innerHTML)
    }
  }
  const state = createState({
    state: serverState,
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
