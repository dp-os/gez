# class-state
使用类来管理应用状态，与框架无关

## 安装
```bash
npm install class-state
```

## 快速使用
```ts
import { createState, connectState } from 'class-state'

const state = createState()
const connectStore = connectState(state)

class Count {
  public value = 0
  public $increase () {
    this.value++
  }
}

const user = connectStore(Count, 'count')

user.$increase()

```
