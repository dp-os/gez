import { type Genesis, type GenesisOptions } from './genesis'
import { type App } from './app'

export interface NodeOptions extends GenesisOptions {
  created: (genesis: Genesis, app: App) => void
}

export function defineNode (options: NodeOptions) {
  return options
}
