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

export const App = component$(() => {
  const state = createState(useStore({ value: {} }))

  useContextProvider(PROVIDE_STORE_KEY, state)

  // 模拟服务端请求
  useTask$(async () => {
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        Count.use(state).$updateTime()
        resolve()
      }, 200)
    })
  })

  // 客户端继续更新状态
  useVisibleTask$((taskContext) => {
    const timer = setInterval(Count.use(state).$updateTime, 1000)

    taskContext.cleanup(() => {
      clearInterval(timer)
    })
  })

  const count = Count.use()
  return (
    <>
      <div class="app">
        <p>Current Time: {count.now}</p>
        <Child />
        <p>Click Count: {count.value}</p>
      </div>
    </>
  )
})
