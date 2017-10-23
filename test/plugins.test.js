// Tests for consumer API
import { createPlugins, modelHooks, pluginMiddlewares } from '../src/core'

beforeEach(() => {
  jest.resetModules()
})

describe('plugins:', () => {
  test('should add onModel subscriptions', () => {
    const fns = [() => 1, () => 2]
    const plugins = [{
      onModel: fns[0],
    }, {
      onModel: fns[1]
    }]
    createPlugins(plugins)
    expect(modelHooks).toEqual(fns)
  })

  test('should add multiple middleware', () => {
    const m1 = () => next => action => next(action)
    const m2 = () => next => action => next(action)
    const plugins = [{
      middleware: m1,
    }, {
      middleware: m2
    }]
    createPlugins(plugins)
    expect(pluginMiddlewares).toEqual([m1, m2])
  })

  test('should add a model', () => {
    const { init, getStore } = require('../src')
    init({
      plugins: [{
        model: {
          name: 'a',
          state: 0,
        }
      }]
    })
    expect(getStore().getState()).toEqual({ a: 0 })
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
