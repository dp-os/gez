import { type State, connectState } from 'class-state'
import { inject } from 'vue'

export const PROVIDE_STORE_KEY = Symbol('class-state')

export function useState () {
  return inject(PROVIDE_STORE_KEY) as State
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
