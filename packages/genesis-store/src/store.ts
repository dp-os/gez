import { type RootState, isStateValue, getState } from './state'

export class Store {
  public constructor (rootState: RootState, name: string) {
    const map = new Map<string, Function>()
    const _rootState: any = rootState
    return new Proxy(this, {
      get (target: any, p) {
        let value = target[p]
        if (isStateValue(value)) {
          const state = _rootState[name]
          if (state) {
            value = state[p]
          }
        } else if (typeof p === 'string' && p[0] === '$' && typeof value === 'function') {
          const source = value
          value = map.get(p)
          if (!value) {
            value = function (...args: any[]) {
              if (!_rootState[name]) {
                const state: any = {}
                Object.keys(target).forEach(k => {
                  const value = target[k]
                  if (isStateValue(value)) {
                    state[k] = value
                  }
                })
                _rootState[name] = state
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
        if (isStateValue(newValue)) {
          getState(rootState, name)[p] = newValue
        }
        target[p] = newValue
        return true
      }
    })
  }
}
