import { createState } from 'class-state'
import {
  component$,
  useStore,
  useVisibleTask$,
  useContextProvider
} from '@builder.io/qwik'
import { Count, PROVIDE_STORE_KEY, useState } from './store'

const Child = component$(() => {
  const count = Count.use()
  return (
    <div>
      4444:{count.value}
    </div>
  )
})

const Add = component$(() => {
  const state = useState()
  return (
    <button
      onClick$={async () => {
        Count.use(state).$inc()
      }}
    >
      {Count.use(state).value}
      +
    </button>
  )
})

const App = component$(() => {
  const state = createState({
    proxy: useStore
  })

  useVisibleTask$(async () => {
    createState({
      state
    })
  })
  useContextProvider(PROVIDE_STORE_KEY, state)
  const count = Count.use()
  return (
    <>
      <head>
        <title>Title</title>
      </head>
      <body>
        <div class="count">3333:{count.value}</div>
        <Child />
        <Add />
      </body>
    </>
  )
})

export const AppNode = <App />
