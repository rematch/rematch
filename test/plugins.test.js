beforeEach(() => {
  jest.resetModules()
})

describe('plugins:', () => {
  test('should throw if plugin creator is not a function', () => {
    const { createPlugins } = require('../src/core')
    const plugin1 = {
      middleware: {},
    }
    const plugins = [plugin1]
    expect(() => createPlugins(plugins)).toThrow()
  })

  test('should add onModel subscriptions', () => {
    const { init } = require('../src')
    const { modelHooks } = require('../src/core')
    const fns = [() => 1, () => 2]
    init({
      plugins: [
        () => ({ onModel: fns[0] }),
        () => ({ onModel: fns[1] }),
      ]
    })
    expect(modelHooks.slice(-2)).toEqual(fns)
  })

  test('should add multiple middleware', () => {
    const { init } = require('../src')
    const { pluginMiddlewares } = require('../src/core')
    const m1 = () => next => action => next(action)
    const m2 = () => next => action => next(action)
    init({
      plugins: [
        () => ({ middleware: m1 }),
        () => ({ middleware: m2 }),
      ]
    })
    expect(pluginMiddlewares.slice(-2)).toEqual([m1, m2])
  })

  test('should add a model', () => {
    const { init, getStore } = require('../src')
    const model = {
      name: 'a',
      state: 0,
    }
    init({
      plugins: [() => ({ model })]
    })
    expect(getStore().getState()).toEqual({ a: 0 })
  })

  test('should not create a plugin with invalid "onModel"', () => {
    const { createPlugins } = require('../src/core')
    const plugin1 = () => ({
      onModel: {},
    })
    const plugins = [plugin1]
    expect(() => createPlugins(plugins)).toThrow()
  })

  test('should not create a plugin with invalid "middleware"', () => {
    const { createPlugins } = require('../src/core')
    const plugin1 = () => ({
      middleware: {},
    })
    const plugins = [plugin1]
    expect(() => createPlugins(plugins)).toThrow()
  })

})
