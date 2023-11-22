import {
  createContextId,
  useContext
} from '@builder.io/qwik'
import { type State, connectState } from 'class-state'

export const PROVIDE_STORE_KEY = createContextId<State>(
  'class-state'
)

export function useState (): State {
  return useContext(PROVIDE_STORE_KEY) as any
}

export class Count {
  public static use (state: State = useState()) {
    return connectState(state)(this, 'count')
  }

  public value: number = 0
  public serverTime: string = ''
  public $inc () {
    this.value++
  }

  public $dec () {
    this.value--
  }

  public $setTime () {
    this.serverTime = new Date().toISOString()
  }
}
