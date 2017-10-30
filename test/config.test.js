beforeEach(() => {
  jest.resetModules()
})

describe('init config', () => {
  test('should not throw with an empty config', () => {
    const { init } = require('../src')
    expect(() => init()).not.toThrow()
  })
  test('should not accept invalid plugins', () => {
    const { init } = require('../src')
    expect(() => init({
      plugins: {}
    })).toThrow()
  })

  test('should not accept invalid "middleware"', () => {
    const { init } = require('../src')
    expect(() => init({
      middleware: {}
    })).toThrow()
  })

  test('should not accept invalid array for "extraReducers"', () => {
    const { init } = require('../src')
    expect(() => init({
      extraReducers: []
    })).toThrow()
  })

  test('should not accept invalid value as "extraReducers"', () => {
    const { init } = require('../src')
    expect(() => init({
      extraReducers: 42
    })).toThrow()
  })

  test('should not accept invalid value as "customCombineReducers"', () => {
    const { init } = require('../src')
    expect(() => init({
      customCombineReducers: 42
    })).toThrow()
  })
})
