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

// 连接 Store 
const user = connectStore(Count, Count.storeName)
// 调用 $ 函数，更新状态
user.$increase()
// 输出为：1
console.log(user.count)
```

## 兼容性
基于`proxy`和`WeakMap`

