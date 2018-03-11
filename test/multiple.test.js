const { init } = require('../src')

describe('multiple stores', () => {
  test('should not throw if multiple stores', () => {
    const store1 = init({})
    expect(() => init({})).not.toThrow()
  })

  test('should store state for multiple stores', () => {
    const store1 = init({ models: { count1: { state: 0 } } })
    const store2 = init({ models: { count2: { state: 42 } } })

    expect(store1.getState()).toEqual({ count1: 0 })
    expect(store2.getState()).toEqual({ count2: 42 })
  })

  test('should be able to store.dispatch to specific stores', () => {
    const count = {
      state: 0,
      reducers: {
        increment: (state) => state + 1,
      }
    }

    const store1 = init({ models: { count } })
    const store2 = init({ models: { count } })

    store1.dispatch.count.increment()

    store2.dispatch.count.increment()
    store2.dispatch.count.increment()

    expect(store1.getState()).toEqual({ count: 1 })
    expect(store2.getState()).toEqual({ count: 2 })
  })

  test('global dispatch should dispatch to both stores', () => {
    const { dispatch } = require('../src')

    const count = {
      state: 0,
      reducers: {
        increment: (state) => state + 1,
      }
    }

    const store1 = init({ models: { count } })
    const store2 = init({ models: { count } })

    dispatch.count.increment()
    dispatch.count.increment()

    expect(store1.getState()).toEqual({ count: 2 })
    expect(store2.getState()).toEqual({ count: 2 })
  })
})