beforeEach(() => {
  jest.resetModules()
})

const count = {
  state: 0,
  reducers: {
    addOne: s => s + 1
  },
  effects: {
    async timeout() {
      await setTimeout(() => {}, 1000)
    }
  }
}

describe('loading', () => {
  test('loading.global should be false for normal dispatched action', () => {
    const {
      init, dispatch
    } = require('../../../src')
    const loadingPlugin = require('../src').default
    const store = init({
      models: { count },
      plugins: [loadingPlugin()]
    })
    dispatch.count.addOne()
    expect(store.getState().loading.global).toBe(false)
  })

  test('loading.global should be true for dispatched effect', () => {
    const {
      init, dispatch
    } = require('../../../src')
    const loadingPlugin = require('../src').default
    const store = init({
      models: { count },
      plugins: [loadingPlugin()]
    })
    dispatch.count.timeout()
    expect(store.getState().loading.global).toBe(true)
  })

  test('should set loading.models[name] to false', () => {
    const {
      init
    } = require('../../../src')
    const loadingPlugin = require('../src').default
    const store = init({
      models: { count },
      plugins: [loadingPlugin()]
    })
    expect(store.getState().loading.models.count).toBe(false)
  })

  test('should change the loading.models', () => {
    const {
      init, dispatch
    } = require('../../../src')
    const loadingPlugin = require('../src').default
    const store = init({
      models: { count },
      plugins: [loadingPlugin()]
    })
    dispatch.count.timeout()
    expect(store.getState().loading.models.count).toBe(true)
  })

  test('should set loading.effects[name] to object of effects', () => {
    const {
      init
    } = require('../../../src')
    const loadingPlugin = require('../src').default
    const store = init({
      models: { count },
      plugins: [loadingPlugin()]
    })
    expect(store.getState().loading.effects.count.timeout).toBe(false)
  })

  test('should change the loading.effects', () => {
    const {
      init, dispatch
    } = require('../../../src')
    const loadingPlugin = require('../src').default
    const store = init({
      models: { count },
      plugins: [loadingPlugin()]
    })
    dispatch.count.timeout()
    expect(store.getState().loading.effects.count.timeout).toBe(true)
  })

  test('should configure the loading name', () => {
    const {
      init, dispatch
    } = require('../../../src')
    const loadingPlugin = require('../src').default
    const store = init({
      models: { count },
      plugins: [loadingPlugin({ name: 'load' })]
    })
    dispatch.count.addOne()
    expect(store.getState().load.global).toBe(false)
  })

  // test('should handle "hide" if effect throws', () => {
  //   const {
  //     init, dispatch
  //   } = require('../../../src')
  //   const loadingPlugin = require('../src').default
  //   const count = {
  //     state: 0,
  //     effects: {
  //       throwError() {
  //         throw new Error('effect error')
  //       }
  //     }
  //   }
  //   const store = init({
  //     models: { count },
  //     plugins: [loadingPlugin()]
  //   })
  //   dispatch.count.throwError()
  //   expect(store.getState().loading.global).toBe(false)
  // })
})
