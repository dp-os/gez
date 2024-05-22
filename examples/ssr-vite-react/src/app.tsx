import { useState } from 'react'
import { type State } from 'class-state'
import './style.css'
import { StateContext, Count } from './store'
import { Child } from './child'
export function App () {
  const [state] = useState<State>({ value: {} })

  // React 的上下文注入是通过组件的形式，这里是获取不到上下文的，所以这里需要传入 state
  const count = Count.use(state)
  return (
    <StateContext.Provider value={state}>
      <div>
        <Child />
        <p>Click Count: {count.value}</p>
      </div>
    </StateContext.Provider>
  )
}

export const app = <App />
