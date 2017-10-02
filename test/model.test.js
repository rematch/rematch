// Test for model
import { init, model } from '../src/index'
import { store } from '../src/store'

beforeEach(() => {
  jest.resetModules()
})

describe('model', () => {
  it('should create a store with state', () => {
    init()

    model({
      name: 'count',
      state: 99,
    })

    expect(store.getState()).toEqual({ count: 99 })
  })

  it('should allow multiple models', () => {
    init()

    model({
      name: 'count',
      state: 99,
    })

    model({
      name: 'score',
      state: 42,
    })

    expect(store.getState()).toEqual({ count: 99, score: 42 })
  })
})
