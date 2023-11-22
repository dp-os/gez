import type { StoreContext } from './connect'

const MODIFY_COUNT = '__modify_count_'
export interface State {
  [MODIFY_COUNT]: number
  [x: string]: any
}

export interface StateOptions {
  /**
     * When rendering on the server, it is necessary to pass in the state
     */
  state?: Record<string, any>
  proxy?: (target: any) => any
  set?: (state: State, name: string, value: any) => void
  del?: (state: State, name: string) => void
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
  public constructor (options: StateOptions) {
    const state = options.state ? options.state : {}
    state[MODIFY_COUNT] = 0
    const _options = this._options = {
      proxy: options.proxy ?? DEFAULT_OPTIONS.proxy,
      set: options.set ?? DEFAULT_OPTIONS.set,
      del: options.del ?? DEFAULT_OPTIONS.del
    }

    this.state = _options.proxy(state)
    this._options = _options
  }

  public depend (fullPath: string = MODIFY_COUNT): unknown {
    return this.state[fullPath]
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
      state[name] = nextState
    } else {
      _options.set(state, name, nextState)
      state[MODIFY_COUNT]++
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
