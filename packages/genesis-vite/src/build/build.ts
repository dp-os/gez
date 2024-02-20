import { type Genesis } from 'genesis3'

import { buildClient } from './build-client'
import { buildServer } from './build-server'
import { buildNode } from './build-node'
import { buildFederation } from './build-federation'

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

  // 只有 build client 和 build server 都执行才需要执行以下步骤
  if (!args.includes('--no-build-client') && !args.includes('--no-build-server')) {
    await buildFederation()
  }
}
