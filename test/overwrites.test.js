beforeEach(() => {
  jest.resetModules()
})

describe('overwrites', () => {
  test('combineReducers should replace root', () => {
    const { init, getStore } = require('../build')
    init({
      redux: {
        initialState: {},
        reducers: {
          a: () => 12,
          b: () => 27,
        },
        combineReducers: () => () => 42,
      }
    })
    expect(getStore().getState()).toBe(42)
  })
  test('should not accept invalid value as "overwrites.combineReducers"', () => {
    const { init } = require('../build')
    expect(() => init({
      redux: {
        combineReducers: 42
      }
    })).toThrow()
  })

  test('combineReducers should replace root', () => {
    const { init, getStore } = require('../build')
    init({
      redux: {
        initialState: {},
        createStore: () => ({
          getState: () => 42,
        }),
      }
    })
    expect(getStore().getState()).toBe(42)
  })

  test('should not accept invalid value as "overwrites.createStore"', () => {
    const { init } = require('../build')
    expect(() => init({
      redux: {
        createStore: 42
      }
    })).toThrow()
  })
})
