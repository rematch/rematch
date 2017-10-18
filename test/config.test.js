import { init } from '../src/index'

beforeEach(() => {
  jest.resetModules()
})

describe('init config', () => {
  test('should not throw with an empty config', () => {
    expect(() => init()).not.toThrow()
  })
  test('should not accept invalid plugins', () => {
    expect(() => init({
      plugins: {}
    })).toThrow()
  })

  test('should not accept invalid "middleware"', () => {
    expect(() => init({
      middleware: {}
    })).toThrow()
  })

  test('should not accept invalid "extraReducers"', () => {
    expect(() => init({
      extraReducers: []
    })).toThrow()
  })
})
