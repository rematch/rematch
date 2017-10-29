beforeEach(() => {
  jest.resetModules()
})

describe('loading', () => {
  it('loading.global should be false for normal dispatched action', () => {
    const { init, model, dispatch, getStore } = require('../src/index')
    const loadingPlugin = require('../src/plugins/loading').default
    init({
      plugins: [loadingPlugin]
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
  it('loading.global should be true for dispatched effect', () => {
    const { init, model, dispatch, getStore } = require('../src/index')
    const loadingPlugin = require('../src/plugins/loading').default
    init({
      plugins: [loadingPlugin]
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
  it('should change the loading.models', () => {
    const { init, model, dispatch, getStore } = require('../src/index')
    const loadingPlugin = require('../src/plugins/loading').default
    init({
      plugins: [loadingPlugin]
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
  it('should change the loading.effects', () => {
    const { init, model, dispatch, getStore } = require('../src/index')
    const loadingPlugin = require('../src/plugins/loading').default
    init({
      plugins: [loadingPlugin]
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
})