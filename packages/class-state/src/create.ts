import type { StoreContext } from './connect'
export interface State {
  /**
     * Just for the TS type to be checked correctly, this attribute does not exist in actual operation
     */
  'https://github.com/dp-os/class-state': Record<string, any>
  [x: string]: Record<string, any>
}

export interface StateOptions {
  /**
     * When rendering on the server, it is necessary to pass in the state
     */
  state?: Record<string, any> | string
  proxy?: (target: any) => any
  set?: (state: State, name: string, value: any) => void
  del?: (state: State, name: string) => void
}

interface ModifyCount {
  value: number
}

const DEFAULT_OPTIONS = {
  proxy: (target: any) => target,
  set: (state: State, name: string, value: any) => {
    state[name] = value
  },
  del: (state: State, name: string) => {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete state[name]
  }
} satisfies StateOptions

export class StateContext {
  public readonly state: State
  private readonly storeContext: Map<string, StoreContext<any>> = new Map<string, StoreContext<any>>()
  private readonly _options: Omit<Required<StateOptions>, 'state'>
  private readonly _count: ModifyCount
  public constructor (options: StateOptions) {
    const state = options.state ? options.state : {}

    const _options = this._options = {
      proxy: options.proxy ?? DEFAULT_OPTIONS.proxy,
      set: options.set ?? DEFAULT_OPTIONS.set,
      del: options.del ?? DEFAULT_OPTIONS.del
    }

    this._count = _options.proxy({ value: 0 })
    this.state = _options.proxy(state)
    this._options = _options
  }

  public depend (fullPath?: string): unknown {
    if (fullPath) {
      return this.state[fullPath]
    } else {
      return this._count.value
    }
  }

  public hasState (name: string): boolean {
    return name in this.state
  }

  public get (name: string): StoreContext<any> | null {
    return this.storeContext.get(name) ?? null
  }

  public add (name: string, storeContext: StoreContext<any>) {
    this.storeContext.set(name, storeContext)
  }

  public updateState (name: string, nextState: any) {
    const { state, _options } = this
    if (name in state) {
      state[name] = _options.proxy(nextState)
    } else {
      _options.set(state, name, nextState)
      this._count.value++
    }
  }

  public del (name: string) {
    const { _options } = this
    this.storeContext.delete(name)
    _options.del(this.state, name)
  }
}

const rootMap = new WeakMap<State, any>()

function setStateContext (state: State, context: StateContext) {
  rootMap.set(state, context)
}

export function getStateContext (state: State): StateContext {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return rootMap.get(state)!
}

export function createState (options: StateOptions = {}): State {
  const stateContext = new StateContext(options)

  setStateContext(stateContext.state, stateContext)

  return stateContext.state
}
