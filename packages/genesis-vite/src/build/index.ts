import { type Genesis } from 'genesis3'

import { buildClient } from './build-client'
import { buildServer } from './build-server'
import { buildNode } from './build-node'

export async function build (genesis: Genesis) {
  const source = genesis.getProjectPath('src')
  const args = process.argv
  if (!args.includes('--no-build-client')) {
    await buildClient(genesis, source)
  }
  if (!args.includes('--no-build-server')) {
    await buildServer(genesis, source)
  }
  if (!args.includes('--no-build-node')) {
    await buildNode(genesis, source)
  }
}
