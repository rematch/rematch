beforeEach(() => {
  jest.resetModules()
})

describe('overwrites', () => {
  test('combineReducers should replace root', () => {
    const { init, getStore } = require('../src')
    init({
      initialState: {},
      extraReducers: {
        a: () => 12,
        b: () => 27,
      },
      overwrites: {
        combineReducers: () => () => 42
      }
    })
    expect(getStore().getState()).toBe(42)
  })
  test('should not accept invalid value as "overwrites.combineReducers"', () => {
    const { init } = require('../src')
    expect(() => init({
      overwrites: {
        combineReducers: 42
      }
    })).toThrow()
  })

  test('combineReducers should replace root', () => {
    const { init, getStore } = require('../src')
    init({
      initialState: {},
      overwrites: {
        createStore: () => ({
          getState: () => 42,
        }),
      }
    })
    expect(getStore().getState()).toBe(42)
  })

  test('should not accept invalid value as "overwrites.createStore"', () => {
    const { init } = require('../src')
    expect(() => init({
      overwrites: {
        createStore: 42
      }
    })).toThrow()
  })
})
