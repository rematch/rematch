const { init } = require('../src')

describe('globalDispatch:', () => {
  test('should run reducers', () => {
    const { dispatch } = require('../src')
    const store = init({
      models: {
        count: {
          state: 0,
          reducers: {
            addOne(state) {
              return state + 1
            }
          }
        }
      }
    })

    dispatch.count.addOne()
    dispatch.count.addOne()
    expect(store.getState().count).toBe(2)
  })
})