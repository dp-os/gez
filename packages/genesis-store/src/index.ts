/* eslint-disable @typescript-eslint/no-empty-interface */
export {}

export interface RootState {}

export interface DefineStoreOptions<State> {
  state: () => State
}

export function defineStore<State> (name: string, options: DefineStoreOptions<State>) {
  const defaultState = options.state()
  return {
    useState (rootState: RootState) {
      if (name in rootState) {
        return (rootState as any)[name] as State
      }
      return defaultState
    }
  }
}
