// Tests for consumer API
import createPlugins, { onModelHooks, pluginMiddlwares } from '../src/core'

beforeEach(() => {
  jest.resetModules()
})

describe('plugins:', () => {
  test('should add onModel hooks', () => {
    const fns = [() => 1, () => 2]
    const plugins = [{
      onModel: fns[0],
    }, {
      onModel: fns[1]
    }]
    createPlugins(plugins, [])
    expect(onModelHooks).toEqual(fns)
  })

  xtest('should add middleware hooks', () => {
    const m1 = () => next => action => next(action)
    const m2 = () => next => action => next(action)
    const hooks = [{
      middleware: m1,
    }, {
      middleware: m2
    }]
    createPlugins(hooks, [])
    expect(pluginMiddlwares).toEqual([m1, m2])
  })

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
