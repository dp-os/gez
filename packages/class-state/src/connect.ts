/* eslint-disable @typescript-eslint/no-this-alias */
import { produce } from 'immer'
import { type State, getStateContext, type StateContext } from './create'
import { createFullPath } from './path'

export type StoreParams = Record<string, any>
export type StoreConstructor = new(...args: any[]) => any

export type StoreInstance<T extends {}> = T & { $: StoreContext<T> }

let currentStateContext: StateContext | null = null

export class StoreContext<T extends {}> {
  /**
     * Library private properties, not available externally
     */
  private _stateContext: StateContext | null
  /**
     * Library private properties, not available externally
     */
  private readonly _raw: T
  /**
     * Library private properties, not available externally
     */
  public _proxy: StoreInstance<T>
  /**
     * Is the state a draft state
     */
  private _drafting = false
  /**
     * Is the state a draft state
     */
  private readonly _cacheCommit = new Map<Function, Function>()
  /**
     * Path in state
     */
  public readonly fullPath: string
  /**
     * State of Store
     */
  public state: Record<string, any>
  public connecting: boolean
  public constructor (stateContext: StateContext, raw: any, state: Record<string, any>, fullPath: string) {
    this._stateContext = stateContext
    stateContext.add(fullPath, this)

    this._raw = raw
    this._proxy = this._createProxyClass()

    this.state = state
    this.fullPath = fullPath
    this.connecting = stateContext.hasState(fullPath)
  }

  /**
     * Library private method, not available externally
     */
  public _setState (nextState: Record<string, any>) {
    const { _stateContext, fullPath } = this
    this.state = nextState
    if (_stateContext) {
      _stateContext.updateState(fullPath, nextState)
    }
    this.connecting = !!_stateContext
    this._proxy = this._createProxyClass()
  }

  /**
     * Disconnect from state and release memory
     */
  public disconnect = () => {
    const { _stateContext } = this
    if (_stateContext) {
      _stateContext.del(this.fullPath)
      this._stateContext = null
    }
  }

  private _createProxyClass () {
    const storeContext = this
    return new Proxy(this._raw, {
      get (target, p, receiver) {
        if (p === '$') {
          return storeContext
        } else if (typeof p === 'string') {
          const state = storeContext.state
          if (p in state) {
            const stateContext = storeContext._stateContext
            if (stateContext) {
              if (storeContext.connecting) {
                stateContext.depend(storeContext.fullPath)
              } else {
                stateContext.depend()
              }
            }
            return state[p]
          }
        }
        currentStateContext = storeContext._stateContext
        const result = Reflect.get(target, p, receiver)
        currentStateContext = null
        if (typeof result === 'function' && typeof p === 'string' && p.startsWith('$')) {
          let func = storeContext._cacheCommit.get(result)
          if (!func) {
            func = storeContext._createProxyCommit(result)
            storeContext._cacheCommit.set(result, func)
          }
          return func
        }

        return result
      },
      set (target, p, newValue, receiver) {
        if (typeof p === 'string' && p in storeContext.state) {
          if (storeContext._drafting) {
            storeContext.state[p] = newValue
            return true
          }
          throw new Error(`Change the state in the agreed commit function, For example, $${p}('${String(newValue)}')`)
        }
        return Reflect.set(target, p, newValue, receiver)
      }
    }) as any
  }

  private _createProxyCommit (commitFunc: Function) {
    const connectContext = this
    return function proxyCommit (...args: any) {
      if (connectContext._drafting) {
        return commitFunc.apply(connectContext._proxy, args)
      }

      const prevState = connectContext.state
      let result
      const nextState = produce(prevState, (draft) => {
        connectContext._drafting = true
        connectContext.state = draft
        try {
          result = commitFunc.apply(connectContext._proxy, args)
          connectContext._drafting = false
          connectContext.state = prevState
        } catch (e) {
          connectContext._drafting = false
          connectContext.state = prevState
          throw e
        }
      })
      connectContext._setState(nextState)
      return result
    }
  }
}

export function connectState (state: State) {
  const stateContext = getStateContext(state)
  return <T extends StoreConstructor>(Store: T, name: string, ...params: ConstructorParameters<T>): StoreInstance<InstanceType<T>> => {
    const fullPath = createFullPath(name, params[0])
    let storeContext: StoreContext<T> | null = stateContext.get(fullPath)
    if (!storeContext) {
      const store = new Store(...params)
      let storeState
      if (fullPath in state.value) {
        storeState = { ...store, ...state.value[fullPath] }
      } else {
        storeState = { ...store }
      }
      storeContext = new StoreContext(stateContext, store, storeState, fullPath)
    }
    return storeContext._proxy as any
  }
}

export function connectStore<T extends StoreConstructor> (Store: T, name: string, ...params: ConstructorParameters<T>) {
  if (!currentStateContext) {
    throw new Error('No state context found')
  }
  return connectState(currentStateContext.state)(Store, name, ...params)
}
