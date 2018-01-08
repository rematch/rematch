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
      this.addOne()
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

  test('should throw if loading name is not a string', () => {
    const {
      init, dispatch
    } = require('../../../src')
    const loadingPlugin = require('../src').default
    const createStore = () => init({
      models: { count },
      plugins: [loadingPlugin({ name: 42 })]
    })
    expect(createStore).toThrow()
  })

  test('should block items if not in whitelist', () => {
    const {
      init, dispatch
    } = require('../../../src')
    const loadingPlugin = require('../src').default
    const store = init({
      models: { count },
      plugins: [loadingPlugin({
        whitelist: ['some/action'],
      })]
    })
    dispatch.count.timeout()
    expect(store.getState().loading.models.count).toBe(false)
  })

  test('should block items if in blacklist', () => {
    const {
      init, dispatch
    } = require('../../../src')
    const loadingPlugin = require('../src').default
    const store = init({
      models: { count },
      plugins: [loadingPlugin({
        blacklist: ['count/timeout'],
      })]
    })
    dispatch.count.timeout()
    expect(store.getState().loading.models.count).toBe(false)
  })

  test('should throw if whitelist is not an array', () => {
    const {
      init, dispatch
    } = require('../../../src')
    const loadingPlugin = require('../src').default
    const createStore = () => init({
      models: { count },
      plugins: [loadingPlugin({
        whitelist: 'some/action',
      })]
    })
    expect(createStore).toThrow()
  })

  test('should throw if blacklist is not an array', () => {
    const {
      init, dispatch
    } = require('../../../src')
    const loadingPlugin = require('../src').default
    const createStore = () => init({
      models: { count },
      plugins: [loadingPlugin({
        blacklist: 'some/action',
      })]
    })
    expect(createStore).toThrow()
  })

  test('should throw if contains both a whitelist & blacklist', () => {
    const {
      init, dispatch
    } = require('../../../src')
    const loadingPlugin = require('../src').default
    const createStore = () => init({
      models: { count },
      plugins: [loadingPlugin({
        whitelist: ['some/action'],
        blacklist: ['some/action'],
      })]
    })
    expect(createStore).toThrow()
  })

  test('should handle "hide" if effect throws', async () => {
    const {
      init, dispatch
    } = require('../../../src')
    const loadingPlugin = require('../src').default
    const count = {
      state: 0,
      effects: {
        throwError() {
          throw new Error('effect error')
        }
      }
    }
    const store = init({
      models: { count },
      plugins: [loadingPlugin()]
    })
    await dispatch.count.throwError()
    expect(store.getState().loading.global).toBe(false)
  })

  test('should trigger three actions', async () => {
    const {
      init, dispatch
    } = require('../../../src')
    const loadingPlugin = require('../src').default

    let actions = []

    const store = init({
      models: { count },
      plugins: [loadingPlugin()],
      redux: {
        middlewares: [() => () => action => {
          actions.push(action.type)
        }]
      }
    })

    await dispatch.count.timeout()
    
    expect(actions).toEqual(['loading/show', 'count/addOne', 'loading/hide'])
  })
})
