import { createContext, useContext, useSyncExternalStore } from 'react'

import { type State, connectState } from 'class-state'

// 创建状态的上下文
export const StateContext = createContext<State>({
  value: {}
})

// 获取状态
export function useState (): State {
  return useContext(StateContext)
}

// 定义类
export class Count {
  // 定义使用方法
  public static use (state: State = useState()) {
    const count = connectState(state)(this, 'count')
    return useSyncExternalStore(count.$.subscribe, count.$.get, count.$.get)
  }

  // 定义值
  public value: number = 0
  // 值加加
  public $inc () {
    this.value++
  }

  // 值减减
  public $dec () {
    this.value--
  }
}
