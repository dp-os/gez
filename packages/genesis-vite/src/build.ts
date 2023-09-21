import path from 'path'
// import fs from 'fs'
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
  const build = source
  // fs.renameSync(source, build)
  const restore = () => {
    // fs.renameSync(build, source)
  }
  process.on('SIGINT', restore)
  try {
    await buildClient(genesis, build)
    await buildServer(genesis, build)
    await buildNode(genesis, build)
    restore()
  } catch (e) {
    process.off('SIGINT', restore)
    restore()
    console.error(e)
  }
}
