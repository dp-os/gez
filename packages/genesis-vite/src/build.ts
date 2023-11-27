import path from 'node:path'
import fs from 'node:fs'
import { type Genesis } from 'genesis3'
import { build as viteBuild } from 'vite'
import { mergeViteConfig } from './vite-config'

async function buildClient (genesis: Genesis, src: string) {
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
async function buildServer (genesis: Genesis, src: string) {
  await viteBuild(mergeViteConfig(genesis, {
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
async function buildNode (genesis: Genesis, src: string) {
  await viteBuild(mergeViteConfig(genesis, {
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

export async function build (genesis: Genesis) {
  const source = genesis.getProjectPath('src')
  await buildClient(genesis, source)
  await buildServer(genesis, source)
  await buildNode(genesis, source)
}
