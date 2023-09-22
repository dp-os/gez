// /* eslint-disable @typescript-eslint/no-empty-interface */
// export {}

// export interface RootState {
//   // 该对象不可枚举
//   _?: StoreContext
// }

// /**
//  * 数据仓库的上下文对象
//  */

// export interface StoreContext {
//   /**
//    * 一个可以被序列化的对象，该对象给框架层进行代理劫持，比如Qwik、Vue2、Vue3
//    */
//   state: RootState
//   /**
//    * 默认状态，这个是不被任何框架劫持的对象，一个纯粹的JS对象，该对象可被序列化
//    */
//   defaultState: Partial<RootState>
//   /**
//    * 存储 Store 类的实例
//    */
//   instances: Record<string, any>
// }

// export class Tms {
//   public static get (rootState: RootState) {
//     // 首先判断 rootState._ 是否存在
//     // 如果不存在，则创建一个 StoreContext 对象，写入到 rootState._ 中，并且设置为该属性不可枚举
//     // 然后通过 new this(StoreContext) 创建当前的 Store 实例，写入到 StoreContext.instances[this.storeName] 中
//   }

//   public constructor (context: StoreContext) {
//     return new Proxy(this, {
//       get (target, p, receiver) {

//       },
//       set (target, p, newValue, receiver) {
//         // 如果set的 value 是 null、布尔值、字符串、数字，则写入到 state[this.constructor.storeName][p]
//         // 判断是否是首次初始化，如果是首次初始化，则写入到 defaultState，否则写入到 state
//         // 如果不是一个可以被序列化的值，则写入到 this[p] = newValue
//       }
//     })
//   }

//   public $sss () {}
// }

// class HomeStore extends Tms {
//   public name = ''
//   public show = false
//   public $show () {
//     this.show = true
//   }

//   public onClick () {}
// }
// class HomeStore2 extends Tms {
//   public name = ''
//   public show = false
//   public $show () {
//     const ss = HomeStore.get(this.rootState)
//     this.show = true
//   }

//   public onClick () {}
// }

// const home = new HomeStore({})
export {}
