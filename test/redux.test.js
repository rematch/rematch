const { init } = require('../src')

beforeEach(() => {
  jest.resetModules()
})

describe('redux', () => {
  test('combineReducers should replace root', () => {
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
    expect(() => init({
      redux: {
        combineReducers: 42
      }
    })).toThrow()
  })

  test('combineReducers should replace root', () => {
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
    expect(() => init({
      redux: {
        createStore: 42
      }
    })).toThrow()
  })
})
