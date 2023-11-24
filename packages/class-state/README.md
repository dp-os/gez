# class-state
- 使用 class 来创建应用状态
- 不依赖任何前端框架，支持各种前端框架接入
- 状态变化，创建下一个不可变状态树

## 安装
```bash
npm install class-state
```

## 快速使用
```ts
import { createState, connectState, type State } from 'class-state'

// 定义类
class Count {
  // 添加使用的方法
  public static use (state: State) {
    return connectState(state)(this, 'count')
  }

  // 定义值
  public value = 0
  // 通过 $ 函数来修改状态，这是一个约定
  public $inc () {
    this.value++
  }
}

// 创建应用状态
const state = createState()
// 使用 Count 类
const count = Count.use(state)
// 调用 $ 函数，更新状态
count.$inc()
// 打印日志输出: 1
console.log(count.value)

```
## 框架支持
### vue
一个用于构建 Web 用户界面的平易近人、高性能且多功能的框架。
- store.ts
  ```ts
  import { type State, connectState } from 'class-state'
  import { inject } from 'vue'
  
  // 定义根组件供应的 key
  export const STORE_PROVIDE_KEY = Symbol('class-state')
  
  // 添加组合式 API 获取状态的方法
  export function useState () {
    return inject(STORE_PROVIDE_KEY) as State
  }
  // 定义类
  export class Count {
    // 定义使用方法
    public static use (state: State = useState()) {
      // 连接状态
      return connectState(state)(this, 'count')
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
  ```
- app.vue
  ```vue
  <template>
      <div class="app">
          <Child />
          <p>{{ count.value }}</p>
      </div>
  </template>
  <script setup lang="ts">
  import { provide, ref } from 'vue';
  import { createState, State } from 'class-state';
  
  import { STORE_PROVIDE_KEY, Count } from './store'
  import Child from './child.vue';
  
  // 创建状态
  const state = ref<State>({ value: {} })
  // 在组件中供应状态
  provide(STORE_PROVIDE_KEY, state)
  
  // 使用应用状态
  const count = Count.use(state)
  
  </script>
  ```
- child.vue
  ```vue
  <template>
      <div>
          <button @click="count.$inc()">+</button>
          <button @click="count.$dec()">-</button>
      </div>
  </template>
  <script lang="ts" setup>
  import { Count } from './store';
  
  // 在子组件中使用
  const count = Count.use()
  
  </script>
  ```
### Qwik
Qwik 是一种新型 Web 框架，可以提供任何大小或复杂程度的即时加载 Web 应用程序。您的网站和应用程序可以使用大约 1kb 的 JS 启动（无论应用程序复杂程度如何），并大规模实现一致的性能。

- store.ts
  ```ts
  import {
    createContextId,
    useContext
  } from '@builder.io/qwik'
  import { type State, connectState } from 'class-state'
  
  // 定义根组件供应的 key
  export const PROVIDE_STORE_KEY = createContextId<State>(
    'class-state'
  )
  
  // 使用状态
  export function useState (): State {
    return useContext(PROVIDE_STORE_KEY)
  }
  
  // 定义类
  export class Count {
    // 定义使用方法
    public static use (state: State = useState()) {
      return connectState(state)(this, 'count')
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
  ```
- app.tsx
  ```tsx
  import { type State } from 'class-state'
  import {
    component$,
    useStore,
    useContextProvider
  } from '@builder.io/qwik'
  import { Count, PROVIDE_STORE_KEY } from './store'
  import { Child } from './child'
  
  export const App = component$(() => {
    const state = useStore<State>({ value: {} })
  
    useContextProvider(PROVIDE_STORE_KEY, state)
  
    const count = Count.use()
    return (
      <>
        <div class="app">
          <Child />
          <p>Click Count: {count.value}</p>
        </div>
      </>
    )
  })

  ```
- child.tsx
  ```tsx
  import { component$ } from '@builder.io/qwik'
  import { useState, Count } from './store'
  
  export const Child = component$(() => {
    // 使用状态
    const state = useState()
    return (
          <div>
              <button onClick$={() => {
                Count.use(state).$inc()
              }}>+</button>
              <button onClick$={() => {
                Count.use(state).$dec()
              }}>-</button>
          </div>
    )
  })

  ```
### React
Web 和本机用户界面的库
- store.ts
  ```ts
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
      // 如果使用了服务端渲染，第三个参数不可忽略
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
  ```
- app.tsx
  ```tsx
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

  ```
- child.tsx
  ```tsx
  import { Count } from './store'
  
  export const Child = () => {
    const count = Count.use()
    return (
            <div>
                <button onClick={() => {
                  count.$inc()
                }}>+</button>
                <button onClick={() => {
                  count.$dec()
                }}>-</button>
            </div>
    )
  }

  ```
## 兼容性
运行时，需要支持 `Proxy`、`WeakMap`、`Map`

