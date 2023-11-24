# class-state
- 使用 class 来创建应用状态
- 不依赖任何前端框架，都可以接入使用
- 基于 `proxy`，每次状态变化，创建下一个不可变状态树

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
这里提供了一个组合式 API 的例子，适用于 Vue2、Vue3
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
    // 更新状态
    public $inc () {
      this.value++
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
  
  // 创建一个响应式对象
  const refState = ref<State>({ value: {} })
  // 创建应用状态
  const state = createState(refState)
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
  
  const count = Count.use()
  
  </script>
  ```

## 兼容性
基于`proxy`和`WeakMap`

