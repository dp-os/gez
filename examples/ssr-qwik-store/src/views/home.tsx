import { component$ } from '@builder.io/qwik'
import { store, HomeStore } from '../store'

export const Home = component$(() => {
  const rootState = store.useRootState()
  const homeStore = HomeStore.get(rootState)
  return (
        <div>
            {homeStore.name}
            <button onClick$={() => {
              HomeStore.get(rootState).click()
            }}>点击</button>
        </div>
  )
})
