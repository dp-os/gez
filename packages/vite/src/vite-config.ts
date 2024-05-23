import { type InlineConfig, mergeConfig, type PluginOption } from 'vite'
import { type Genesis } from '@gez/core'

export function mergeViteConfig (genesis: Genesis, config: InlineConfig): InlineConfig {
  const plugins: PluginOption[] = []
  return mergeConfig<InlineConfig, InlineConfig>(config, {
    root: genesis.root,
    base: genesis.base,
    plugins
  })
}
