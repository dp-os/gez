// import path from 'node:path'
import { type InlineConfig, mergeConfig, type PluginOption } from 'vite'
import { type Genesis } from 'genesis3'
import viteFederation from '@originjs/vite-plugin-federation'

export function mergeViteConfig (genesis: Genesis, config: InlineConfig, isNode = false): InlineConfig {
  const plugins: PluginOption[] = []
  const { federation } = genesis
  if (federation && !isNode) {
    const exposes: Record<string, string> = {}
    // if (Array.isArray(federation.exposes)) {
    //   federation.exposes.forEach(filename => {
    //     filename = filename.replace(/^src\//, genesis.name + '/')
    //     exposes[`./${filename}`] = path.resolve(genesis.root, filename)
    //   })
    // }
    plugins.push(viteFederation({
      name: genesis.name,
      filename: 'remote-entry.js',
      shared: federation.shared,
      shareScope: federation.shareScope,
      exposes
    }))
  }
  return mergeConfig<InlineConfig, InlineConfig>(config, {
    root: genesis.root,
    base: genesis.base,
    plugins
  })
}
