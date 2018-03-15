beforeEach(() => {
  jest.resetModules()
})

describe('redux', () => {
  test('should replace root with "combineReducers"', () => {
    const { init } = require('../src')
    const store = init({
      redux: {
        initialState: {},
        reducers: {
          a: () => 12,
          b: () => 27,
        },
        combineReducers: () => () => 42,
      }
    })
    expect(store.getState()).toBe(42)
  })
  test('should not accept invalid value as "redux.combineReducers"', () => {
    const { init } = require('../src')
    expect(() => init({
      redux: {
        combineReducers: 42
      }
    })).toThrow()
  })

  test('should replace root with "redux.createStore"', () => {
    const { init } = require('../src')
    const store = init({
      redux: {
        initialState: {},
        createStore: () => ({
          getState: () => 42,
        }),
      }
    })
    expect(store.getState()).toBe(42)
  })

  test('should not accept invalid value as "redux.createStore"', () => {
    const { init } = require('../src')
    expect(() => init({
      redux: {
        createStore: 42
      }
    })).toThrow()
  })
})
