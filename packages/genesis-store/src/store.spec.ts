import { test, assert } from 'vitest'
import { createRootState } from './state'
import { Store } from './store'

test('base', () => {
  const state: any = createRootState()

  class User extends Store {
    public name = ''
    public age = 18
    public $setName (name: string) {
      this.name = name
    }

    public $setAge (age: number) {
      this.age = age
    }

    public $set () {}
  }

  const userStore = new User({
    name: 'user',
    rootState: state
  })

  assert.isUndefined(state.user)
  assert.equal(userStore.name, '')
  assert.equal(userStore.age, 18)

  userStore.$set()
  assert.equal(state.user.name, '')
  assert.equal(state.user.age, 18)

  userStore.$setName('genesis')
  assert.equal(state.user.name, 'genesis')
  assert.equal(userStore.name, 'genesis')
})
