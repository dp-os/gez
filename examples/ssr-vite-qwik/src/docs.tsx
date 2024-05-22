import {
  component$
} from '@builder.io/qwik'
import { App } from './app'

const Docs = component$(() => {
  return (
    <>
      <head>
        <title>Qwik</title>
      </head>
      <body>
        <App />
      </body>
    </>
  )
})

export const DocsRoot = <Docs />
