import Vue from 'vue'
import App from './app.vue'

export function createApp () {
  const app = new Vue({
    render (h) {
      return h(App)
    }
  })
  return { app }
}
