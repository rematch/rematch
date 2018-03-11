const { init } = require('../src')

beforeEach(() => {
  jest.resetModules()
})

describe('plugins:', () => {
  test('should add onModel subscriptions', () => {
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
    const a = {
      state: 0,
    }
    const plugin = {
      config: {
        models: { a }
      }
    }
    const store = init({
      plugins: [plugin]
    })
    expect(store.getState()).toEqual({ a: 0 })
  })

  test('should add multiple models', () => {
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
    const store = init({
      plugins: [plugin]
    })
    expect(store.getState()).toEqual({ a: 0, b: 0 })
  })

  test('should merge plugin configs into configs', () => {
    const plugin1 = {
      config: {
        redux: {
          initialState: {
            app: 1
          }
        }
      },
    }
    const store = init({
      plugins: [plugin1],
    })
    expect(store.getState()).toEqual({ app: 1 })
  })
})
