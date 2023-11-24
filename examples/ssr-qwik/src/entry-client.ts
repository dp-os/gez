import { render, type RenderOptions } from '@builder.io/qwik'
import { DocsRoot } from './docs'

export default async function (opts: RenderOptions) {
  return await render(document, DocsRoot, opts)
}
