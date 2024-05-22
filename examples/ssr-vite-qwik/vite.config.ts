import { defineConfig } from 'vite'
import path from 'node:path'
import { qwikVite } from '@builder.io/qwik/optimizer'

export default defineConfig(() => {
  return {
    plugins: [qwikVite({
      ssr: {
        input: path.resolve('src/entry-server.ts')
      },
      client: {
        input: path.resolve('src/entry-client.ts')
      }
    })],
    build: {
      minify: false
    }
  }
})
