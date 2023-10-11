import { type RootState, isStateValue, getState } from './state'

export interface StoreOptions {
  name: string
  params?: Record<string, string>
  rootState: RootState
}

export class Store {
  public constructor (options: StoreOptions) {
    const map = new Map<string, Function>()
    const name = options.name
    const rootState: any = options.rootState
    return new Proxy(this, {
      get (target: any, p) {
        let value = target[p]
        if (isStateValue(value)) {
          const state = rootState[name]
          if (state) {
            value = state[p]
          }
        } else if (typeof p === 'string' && p[0] === '$' && typeof value === 'function') {
          const source = value
          value = map.get(p)
          if (!value) {
            value = function (...args: any[]) {
              if (!rootState[name]) {
                const state: any = {}
                Object.keys(target).forEach(k => {
                  const value = target[k]
                  if (isStateValue(value)) {
                    state[k] = value
                  }
                })
                rootState[name] = state
              }
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-expect-error
              return source.apply(this, args)
            }
            map.set(p, value)
          }
        }
        return value
      },
      set (target, p, newValue) {
        console.log('>>>>>>>', p, newValue, isStateValue(newValue))
        if (isStateValue(newValue)) {
          getState(rootState, name)[p] = newValue
        }
        target[p] = newValue
        return true
      }
    })
  }
}
