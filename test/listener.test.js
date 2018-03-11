const { init } = require('../src')

describe('listener', () => {
  test('should trigger state changes on another models reducers', () => {
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

    store.dispatch.count1.increment(1)

    expect(store.getState()).toEqual({ count1: 1, count2: 1 })
  })
})