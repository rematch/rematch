describe('listener', () => {
  test('should trigger state changes on another model', () => {
    const { init, dispatch } = require('../src')
    
    const count1 = {
      state: 0,
      reducers: {
        increment: state => state + 1,
      }
    }

    const count2 = {
      state: 0,
      reducers: {
        'count1/increment': state => state + 1
      }
    }

    const store = init({
      models: { count1, count2 }
    })

    dispatch.count1.increment()

    expect(store.getState()).toEqual({ count1: 1, count2: 1 })
  })
})