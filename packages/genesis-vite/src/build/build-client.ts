import path from 'node:path'
import fs from 'node:fs'
import { type Genesis } from 'genesis3'
import { build as viteBuild } from 'vite'
import { mergeViteConfig } from '../vite-config'

export async function buildClient (genesis: Genesis, src: string) {
  await viteBuild(mergeViteConfig(genesis, {
    build: {
      modulePreload: false,
      manifest: true,
      rollupOptions: {
        input: path.resolve(src, 'entry-client.ts')
      },
      outDir: genesis.getProjectPath('dist/client')
    }
  }))
  const filename = path.resolve(genesis.root, 'dist/client/.vite/manifest.json')
  if (fs.existsSync(filename)) {
    fs.renameSync(
      filename,
      genesis.getProjectPath('dist/client/manifest.json')
    )
  }
}
