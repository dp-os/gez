import { Count } from './store'

export const Child = () => {
  const count = Count.use()
  return (
          <div>
              <button onClick={() => {
                count.$inc()
              }}>+</button>
              <button onClick={() => {
                count.$dec()
              }}>-</button>
          </div>
  )
}
