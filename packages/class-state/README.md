# class-state
使用类来管理应用状态，与框架无关

## 安装
```bash
npm install class-state
```

## 快速使用
```ts
import { createState, connectState } from 'class-state'

// 定义 Store 类
class Count {
  // 定义 store 的名字
  public static storeName = 'count'
  public value = 0
  // 通过 $ 函数来修改状态，这是一个约定
  public $increase () {
    this.value++
  }
}

// 创建应用状态
const state = createState()
// 创建 state 和 store 的连接函数
const connectStore = connectState(state)
// 连接 Count Store 
const count = connectStore(Count, Count.storeName)

// 调用 $ 函数，更新状态
count.$increase()
// 输出为：1
console.log(user.count)
```
## 框架支持
### vue
- store.ts
  ```ts
  import { type State, connectState } from 'class-state'
  import { inject } from 'vue'
  
  export const PROVIDE_STORE_KEY = Symbol('class-state')
  
  export function useState () {
    return inject(PROVIDE_STORE_KEY) as State
  }
  
  export class Count {
    public static use (state: State = useState()) {
      return connectState(state)(this, 'count')
    }
  
    public value: number = 0
    public $inc () {
      this.value++
    }
  
    public $dec () {
      this.value--
    }
  }
  
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
- app.vue
  ```vue
  <template>
      <div class="app">
          <Child />
          <p>{{ count.value }}</p>
      </div>
  </template>
  <script setup lang="ts">
  // Vue3 没有 set, del，只需要传入 reactive 即可
  import { provide, reactive, set, del } from 'vue';
  import { createState } from 'class-state';
  
  import { PROVIDE_STORE_KEY, Count } from './store'
  import Child from './child.vue';
  
  
  const state = createState({
      state: {},
      proxy: reactive,
      set,
      del
  })
  provide(PROVIDE_STORE_KEY, state)
  
  
  const count = Count.use(state)
  
  </script>
  ```

## 兼容性
基于`proxy`和`WeakMap`

