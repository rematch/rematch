beforeEach(() => {
  jest.resetModules()
})

describe('loading', () => {
  test('loading.global should be false for normal dispatched action', () => {
    const {
      init, model, dispatch, getStore
    } = require('../../../src/index')
    const loadingPlugin = require('../src').default
    init({
      plugins: [loadingPlugin()]
    })
    model({
      name: 'count',
      state: 0,
      reducers: {
        increment: s => s + 1
      }
    })
    dispatch.count.increment()
    expect(getStore().getState().loading.global).toBe(false)
  })
  test('loading.global should be true for dispatched effect', () => {
    const {
      init, model, dispatch, getStore
    } = require('../../../src/index')
    const loadingPlugin = require('../src').default
    init({
      plugins: [loadingPlugin()]
    })
    model({
      name: 'count',
      state: 0,
      effects: {
        async timeout() {
          await setTimeout(() => {}, 1000)
        }
      }
    })
    dispatch.count.timeout()
    expect(getStore().getState().loading.global).toBe(true)
  })
  test('should set loading.models[name] to false', () => {
    const {
      init, model, getStore
    } = require('../../../src/index')
    const loadingPlugin = require('../src').default
    init({
      plugins: [loadingPlugin()]
    })
    model({
      name: 'count',
      state: 0,
      effects: {
        async timeout() {
          await setTimeout(() => {}, 1000)
        }
      }
    })
    expect(getStore().getState().loading.models.count).toBe(false)
  })
  test('should change the loading.models', () => {
    const {
      init, model, dispatch, getStore
    } = require('../../../src/index')
    const loadingPlugin = require('../src').default
    init({
      plugins: [loadingPlugin()]
    })
    model({
      name: 'count',
      state: 0,
      effects: {
        async timeout() {
          await setTimeout(() => {}, 1000)
        }
      }
    })
    dispatch.count.timeout()
    expect(getStore().getState().loading.models.count).toBe(true)
  })
  test('should set loading.effects[name] to object of effects', () => {
    const {
      init, model, dispatch, getStore
    } = require('../../../src/index')
    const loadingPlugin = require('../src').default
    init({
      plugins: [loadingPlugin()]
    })
    model({
      name: 'count',
      state: 0,
      effects: {
        async timeout() {
          await setTimeout(() => {}, 1000)
        }
      }
    })
    expect(getStore().getState().loading.effects.count.timeout).toBe(false)
  })
  test('should change the loading.effects', () => {
    const {
      init, model, dispatch, getStore
    } = require('../../../src/index')
    const loadingPlugin = require('../src').default
    init({
      plugins: [loadingPlugin()]
    })
    model({
      name: 'count',
      state: 0,
      effects: {
        async timeout() {
          await setTimeout(() => {}, 1000)
        }
      }
    })
    dispatch.count.timeout()
    expect(getStore().getState().loading.effects.count.timeout).toBe(true)
  })
  test('should configure the loading name', () => {
    const {
      init, model, dispatch, getStore
    } = require('../../../src/index')
    const loadingPlugin = require('../src').default
    init({
      plugins: [loadingPlugin({ name: 'load' })]
    })
    model({
      name: 'count',
      state: 0,
      reducers: {
        increment: s => s + 1
      }
    })
    dispatch.count.increment()
    expect(getStore().getState().load.global).toBe(false)
  })
})
