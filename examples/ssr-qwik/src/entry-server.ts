import { defineServer } from 'genesis3'
import {
  renderToString
} from '@builder.io/qwik/server'
import { manifest } from '@qwik-client-manifest'

import { DocsRoot } from './docs'

export default defineServer({
  async render (context) {
    const name = context.genesis.name
    const result = await renderToString(DocsRoot, {
      base: `/${name}/${name}/build/`,
      manifest: manifest ?? {},
      symbolMapper: (symbolName: string, mapper: any) => symbolMapper(name, symbolName, mapper)
    })
    context.html = result.html
  }
})

function symbolMapper (name: string, symbolName: string, mapper: any) {
  const getSymbolHash = (symbolName: string) => {
    const index = symbolName.lastIndexOf('_')
    if (index > -1) {
      return symbolName.slice(index + 1)
    }
    return symbolName
  }
  const defaultChunk = [symbolName, `/${name}/src/${symbolName.toLowerCase()}.js`]
  if (mapper) {
    const hash = getSymbolHash(symbolName)
    return mapper[hash] ?? defaultChunk
  }
  return defaultChunk
}
