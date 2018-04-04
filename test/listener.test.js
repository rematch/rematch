beforeEach(() => {
  jest.resetModules()
})

describe('listener', () => {
  test('should trigger state changes on another models reducers', () => {
    const { init, dispatch } = require('../src')
    
    const count1 = {
      state: 0,
      reducers: {
        increment: (state, payload) => state + payload,
      }
    }

    const count2 = {
      state: 0,
      reducers: {
        'count1/increment': (state, payload) => state + payload
      }
    }

    const store = init({
      models: { count1, count2 }
    })

    dispatch.count1.increment(1)

    expect(store.getState()).toEqual({ count1: 1, count2: 1 })
  })

  test('should trigger state changes on non-model reducers', () => {
    const { init, dispatch } = require('../src')

    const count = {
      state: 0,
      reducers: {
        '#NON_MODEL_ACTION': (state, payload) => state + payload,
      }
    }

    const store = init({
      models: { count }
    })

    dispatch({ type: '#NON_MODEL_ACTION', payload: 1 })

    expect(store.getState()).toEqual({ count: 1 })
  })

  test('should trigger state changes for all three types of listeners on a model', () => {
    const { init, dispatch } = require('../src')

    const count1 = {
      state: 0,
      reducers: {
        increment: (state, payload) => state + payload,
        'count2/increment': (state, payload) => state + payload,
        '#increment': (state, payload) => state + payload,
      }
    }

    const count2 = {
      state: 0,
      reducers: {
        increment: (state, payload) => state + payload,
      }
    }

    const store = init({
      models: { count1, count2 }
    })

    dispatch.count1.increment(1)
    dispatch.count2.increment(1)
    dispatch({ type: '#increment', payload: 1 })

    expect(store.getState()).toEqual({ count1: 3, count2: 1 })
  })

  test('should correctly handle non-model action type with a "/" in it', () => {
    const { init, dispatch } = require('../src')

    const count = {
      state: 0,
      reducers: {
        '#something/else': (state, payload) => state + payload,
      }
    }

    const store = init({
      models: { count }
    })

    dispatch({ type: '#something/else', payload: 1 })

    expect(store.getState()).toEqual({ count: 1 })
  })
})