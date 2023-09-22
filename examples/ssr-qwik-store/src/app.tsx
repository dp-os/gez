import { component$ } from '@builder.io/qwik'
import { store } from './store'
import { Home } from './views/home'
import { About } from './views/about'

const App = component$(() => {
  const state = store.provider()

  return (
    <>
      <head>
        <title>{String(state.count)}</title>
      </head>
      <body>
        <Home />
        <About />
      </body>
    </>
  )
})

export const AppNode = <App />
