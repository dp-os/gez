import { component$ } from '@builder.io/qwik'
import { useState, Count } from './store'

export const Child = component$(() => {
  const state = useState()
  return (
        <div>
            <button onClick$={() => {
              Count.use(state).$inc()
            }}>+</button>
            <button onClick$={() => {
              Count.use(state).$dec()
            }}>-</button>
        </div>
  )
})
