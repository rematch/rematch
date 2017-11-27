beforeEach(() => {
  jest.resetModules()
})

describe('plugins:', () => {
  test('should add onModel subscriptions', () => {
    const { init } = require('../src')
    const { modelHooks } = require('../src/core')
    const fns = [() => 1, () => 2]
    init({
      plugins: [
        { init: () => ({ onModel: fns[0] }) },
        { init: () => ({ onModel: fns[1] }) },
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
        { init: () => ({ middleware: m1 }) },
        { init: () => ({ middleware: m2 }) },
      ]
    })
    expect(pluginMiddlewares.slice(-2)).toEqual([m1, m2])
  })

  test('should add a model', () => {
    const { init, getStore } = require('../src')
    const a = {
      state: 0,
    }
    const plugin = {
      config: {
        models: { a }
      }
    }
    init({
      plugins: [plugin]
    })
    expect(getStore().getState()).toEqual({ a: 0 })
  })

  test('should add multiple models', () => {
    const { init, getStore } = require('../src')
    const a = {
      state: 0,
    }
    const b = {
      state: 0,
    }
    const plugin = {
      config: {
        models: { a, b }
      }
    }
    init({
      plugins: [plugin]
    })
    expect(getStore().getState()).toEqual({ a: 0, b: 0 })
  })

  test('should merge plugin configs into configs', () => {
    const { init, getStore } = require('../src')
    const plugin1 = {
      config: {
        redux: {
          initialState: {
            app: 1
          }
        }
      },
    }
    init({
      plugins: [plugin1],
    })
    expect(getStore().getState()).toEqual({ app: 1 })
  })
})
