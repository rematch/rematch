const { init } = require('../src')

describe('multiple stores:', () => {

  afterEach(() => {
    jest.resetModules()
  })

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
    const { init, dispatch } = require('../src')

    const count = {
      state: 0,
      reducers: {
        increment: (state) => state + 1,
      }
    }

    const store1 = init({ models: { count } })
    const store2 = init({ models: { count } })

    dispatch({ type: 'count/increment' })
    dispatch({ type: 'count/increment' })

    expect(store1.getState()).toEqual({ count: 2 })
    expect(store2.getState()).toEqual({ count: 2 })
  })
  
  test('dispatch should not overwrite another dispatch', () => {
    const { init, dispatch } = require('../src')

    const count1 = {
      state: 0,
      reducers: {
        increment: (state) => state + 1,
      }
    }

    const count2 = {
      state: 0,
      reducers: {
        increment: (state) => state + 2,
      }
    }

    const store1 = init({ models: { count: count1 } })
    const store2 = init({ models: { count: count2 } })

    store1.dispatch({ type: 'count/increment' })
    store2.dispatch({ type: 'count/increment' })

    expect(store1.getState()).toEqual({ count: 1 })
    expect(store2.getState()).toEqual({ count: 2 })
  })

  test('dispatch should not overwrite another effect', async () => {
    const { init, dispatch } = require('../src')

    const calls = []

    const count1 = {
      state: 0,
      effects: {
        async asyncIncrement() {
          await calls.push('count1')
        }
      }
    }

    const count2 = {
      state: 0,
      effects: {
        async asyncIncrement() {
          await calls.push('count2')
        }
      }
    }

    const store1 = init({ models: { count: count1 } })
    const store2 = init({ models: { count: count2 } })

    await store1.dispatch.count.asyncIncrement()
    await store2.dispatch.count.asyncIncrement()

    expect(calls).toEqual(['count1', 'count2'])
  })

  test('global getState should get multiple states', () => {
    const { init, getState } = require('../src')

    const count = {
      state: 42,
    }

    const store1 = init({ models: { count } })
    const store2 = init({ models: { count } })

    expect(getState()).toEqual({
      0: {
        count: 42,
      },
      1: {
        count: 42,
      }
    })
  })

  test('global getState should allow multiple named stores', () => {
    const { init, getState } = require('../src')

    const count = {
      state: 42,
    }

    const store1 = init({ name: 'first', models: { count } })
    const store2 = init({ name: 'second', models: { count } })

    expect(getState()).toEqual({
      first: {
        count: 42,
      },
      second: {
        count: 42,
      }
    })
  })
})