// Tests for consumer API
import createPlugins from '../src/core'

beforeEach(() => {
  jest.resetModules()
})

describe('plugins:', () => {
  test('should not create a plugin with invalid "onModel"', () => {
    const plugin1 = {
      onModel: {},
    }
    const plugins = [plugin1]
    expect(() => createPlugins(plugins)).toThrow()
  })

  test('should not create a plugin with invalid "middleware"', () => {
    const plugin1 = {
      middleware: {},
    }
    const plugins = [plugin1]
    expect(() => createPlugins(plugins)).toThrow()
  })
})
