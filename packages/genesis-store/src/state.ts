const GENESIS_STORE = '__genesis_store__'
export interface RootState {
  [GENESIS_STORE]: true
}

export function createRootState (): RootState {
  return {
    [GENESIS_STORE]: true
  }
}

export function isRootState (state: RootState) {
  return GENESIS_STORE in state
}

export function hasState (state: RootState, name: string) {
  return name in state
}

export function getState (rootState: RootState, name: string) {
  if (!(name in rootState)) {
    (rootState as any)[name] = {}
  }
  return (rootState as any)[name]
}

export function isStateValue (value: unknown) {
  switch (typeof value) {
    case 'string':
    case 'number':
    case 'boolean':
      return true
    case 'object':
      if (value === null) {
        return true
      } else if (Array.isArray(value)) {
        return true
      } else if (Object.getPrototypeOf(value) === Object.prototype) {
        return true
      }
  }
  return false
}
