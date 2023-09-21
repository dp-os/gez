import { render, type RenderOptions } from '@builder.io/qwik'
import { AppNode } from './app'

export default async function (opts: RenderOptions) {
  return await render(document, AppNode, opts)
}
