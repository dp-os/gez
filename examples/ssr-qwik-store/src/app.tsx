import { component$, useStore } from '@builder.io/qwik'

const App = component$(() => {
  const state = useStore({
    count: 0
  })
  return (
    <>
      <head>
        <title>{String(state.count)}</title>
      </head>
      <body>
        <div>
          <h1>Hi 👋</h1>
          {state.count}
          <button onClick$={() => state.count++}>按钮</button>
          <p>
            Can't wait to see what you build with qwik!
            <br />
            Happy coding.
          </p>
        </div>
      </body>
    </>
  )
})

export const AppNode = <App />
