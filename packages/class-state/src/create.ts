import type { StoreContext } from './connect';

export interface State {
    value: Record<string, any>;
}
const rootMap = new WeakMap<State, any>();

export class StateContext {
    public readonly state: State;
    private readonly storeContext: Map<string, StoreContext<any>> = new Map<
        string,
        StoreContext<any>
    >();

    public constructor(state: State) {
        this.state = state;
    }

    public depend(fullPath?: string): unknown {
        if (fullPath) {
            return this.state.value[fullPath];
        }
        return this.state.value;
    }

    public hasState(name: string): boolean {
        return name in this.state.value;
    }

    public get(name: string): StoreContext<any> | null {
        return this.storeContext.get(name) ?? null;
    }

    public add(name: string, storeContext: StoreContext<any>) {
        this.storeContext.set(name, storeContext);
    }

    public updateState(name: string, nextState: any) {
        const { state } = this;
        if (name in state.value) {
            state.value[name] = nextState;
        } else {
            state.value = {
                ...state.value,
                [name]: nextState
            };
        }
    }

    public del(name: string) {
        const { state } = this;
        this.storeContext.delete(name);
        const newValue: Record<string, any> = {};
        Object.keys(state.value).forEach((key) => {
            if (key !== name) {
                newValue[key] = state.value[key];
            }
        });
        state.value = newValue;
    }
}

function setStateContext(state: State, stateContext: StateContext) {
    rootMap.set(state, stateContext);
}

export function getStateContext(state: State): StateContext {
    let stateContext = rootMap.get(state);
    if (stateContext) {
        return stateContext;
    } else {
        stateContext = new StateContext(state);
        setStateContext(state, stateContext);
    }

    return stateContext;
}

export function createState(state?: State): State {
    return getStateContext(
        state?.value && typeof state.value === 'object' ? state : { value: {} }
    ).state;
}
