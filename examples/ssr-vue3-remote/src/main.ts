import { createApp } from 'vue'
import App from './app.vue'

export function createApp () {
  const app = createApp(App)
  return { app }
}
