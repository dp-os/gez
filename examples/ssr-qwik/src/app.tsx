import { createState } from 'class-state'
import {
  component$,
  useStore,
  useVisibleTask$,
  useContextProvider,
  useTask$
} from '@builder.io/qwik'
import { Count, PROVIDE_STORE_KEY } from './store'
import { Child } from './child'

const App = component$(() => {
  const state = createState(useStore({ value: {} }))

  useContextProvider(PROVIDE_STORE_KEY, state)

  // 客户端需要激活状态
  useVisibleTask$(async () => {
    createState(state)
  })

  const count = Count.use()

  // 模拟服务端请求
  useTask$(async () => {
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        Count.use(state).$setTime()
        resolve()
      }, 200)
    })
  })

  // 客户端继续更新状态
  useVisibleTask$((taskContext) => {
    const timer = setInterval(Count.use(state).$setTime, 1000)

    taskContext.cleanup(() => {
      clearInterval(timer)
    })
  })

  return (
    <>
      <head>
        <title>{count.serverTime}</title>
      </head>
      <body>
        <div class="app">
          <p>Current Time: {count.serverTime}</p>
          <Child />
          <p>Click Count: {count.value}</p>
        </div>
      </body>
    </>
  )
})

export const AppNode = <App />
