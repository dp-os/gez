import path from 'node:path'
import { type Genesis } from 'genesis3'
import { build as viteBuild } from 'vite'
import { mergeViteConfig } from '../vite-config'

export async function buildNode (genesis: Genesis, src: string) {
  await viteBuild(mergeViteConfig(genesis, {
    publicDir: false,
    ssr: {
      external: ['genesis3', 'genesis-vite']
    },
    build: {
      rollupOptions: {
        input: path.resolve(src, 'entry-node.ts')
      },
      outDir: genesis.getProjectPath('dist/node'),
      ssr: true
    }
  }, true))
}
