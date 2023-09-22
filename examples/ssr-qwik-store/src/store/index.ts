import { useStore, createContextId, useContext, useContextProvider } from '@builder.io/qwik'
export type TmsConstructor<T extends Tms = Tms> = new (...args: any[]) => T

export class Tms {
  public static storeName: string
  public static get <T extends TmsConstructor>(this: T, rootState: RootState): InstanceType<T> {
    return new this() as any
  }

  public constructor (rootState: RootState) {
    return new Proxy(this, {
      get (target, p, receiver) {
        console.log('>>>>>>', target, p, receiver)
        return target[p]
      }
    })
  }
}

export class HomeStore extends Tms {
  public static storeName = 'home'
  public name = '首页'
  public click () {
    console.log('>>> Good', this)
  }
}

export type RootState = Record<string, any>

function createStore (name: string): RootState {
  const StoreContext = createContextId<RootState>(name)
  return {
    provider () {
      const state = useStore<RootState>({})
      useContextProvider(StoreContext, state)
      return state
    },
    useRootState () {
      return useContext<RootState>(StoreContext)
    }
  }
}

export const store = createStore('store')
