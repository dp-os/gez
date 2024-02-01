import path from 'node:path'
import { type Genesis } from 'genesis3'
import { build as viteBuild } from 'vite'
import { mergeViteConfig } from '../vite-config'

export async function buildServer (genesis: Genesis, src: string) {
  await viteBuild(mergeViteConfig(genesis, {
    publicDir: false,
    ssr: {
      external: [],
      noExternal: [/./]
    },
    build: {
      rollupOptions: {
        input: path.resolve(src, 'entry-server.ts')
      },
      outDir: genesis.getProjectPath('dist/server'),
      ssr: true
    }
  }))
}
