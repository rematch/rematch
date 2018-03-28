const { init } = require('../../../src')
const loadingPlugin = require('../src').default
const { delay, count } = require('./utils')

describe('loading asBoolean', () => {
  test('loading.global should be 0 for normal dispatched action', () => {
    const store = init({
      models: { count },
      plugins: [loadingPlugin()]
    })

    store.dispatch.count.addOne()
    expect(store.getState().loading.global).toBe(false)
  })

  test('loading.global should be 1 for a dispatched effect', () => {
    const store = init({
      models: { count },
      plugins: [loadingPlugin()]
    })

    store.dispatch.count.timeout()
    expect(store.getState().loading.global).toBe(true)
  })

  test('loading.global should be 2 for two dispatched effects', () => {
    const store = init({
      models: { count },
      plugins: [loadingPlugin()]
    })

    store.dispatch.count.timeout()
    store.dispatch.count.timeout()
    expect(store.getState().loading.global).toBe(true)
  })

  test('should set loading.models[name] to false', () => {
    const store = init({
      models: { count },
      plugins: [loadingPlugin()]
    })

    expect(store.getState().loading.models.count).toBe(false)
  })

  test('should change the loading.models to true', () => {
    const store = init({
      models: { count },
      plugins: [loadingPlugin()]
    })

    store.dispatch.count.timeout()
    expect(store.getState().loading.models.count).toBe(true)
  })

  test('should change the loading.models to true (double dispatch)', () => {
    const store = init({
      models: { count },
      plugins: [loadingPlugin()]
    })

    store.dispatch.count.timeout()
    store.dispatch.count.timeout()
    expect(store.getState().loading.models.count).toBe(true)
  })

  test('should set loading.effects[name] to object of effects', () => {
    const store = init({
      models: { count },
      plugins: [loadingPlugin()]
    })
    expect(store.getState().loading.effects.count.timeout).toBe(false)
  })

  test('should change the loading.effects to true', () => {
    const store = init({
      models: { count },
      plugins: [loadingPlugin()]
    })

    store.dispatch.count.timeout()
    expect(store.getState().loading.effects.count.timeout).toBe(true)
  })

  test('should change the loading.effects to true (double dispatch)', () => {
    const store = init({
      models: { count },
      plugins: [loadingPlugin()]
    })

    store.dispatch.count.timeout()
    store.dispatch.count.timeout()
    expect(store.getState().loading.effects.count.timeout).toBe(true)
  })

  test('should capture all model and global loading for simultaneous effects', async () => {
    const count2 = {
      state: 0,
      effects: {
        async timeout1() {
          await delay(200)
        },
        async timeout2() {
          await delay(200)
        }
      }
    }
    const store = init({
      models: { count: count2 },
      plugins: [loadingPlugin()]
    })

    const effect1 = store.dispatch.count.timeout1()
    await delay(100)
    const effect2 = store.dispatch.count.timeout2()

    const ld = () => store.getState().loading
    expect(ld().effects.count.timeout1).toBe(true)
    expect(ld().effects.count.timeout2).toBe(true)
    expect(ld().models.count).toBe(true)
    expect(ld().global).toBe(true)

    await effect1
    expect(ld().effects.count.timeout1).toBe(false)
    expect(ld().effects.count.timeout2).toBe(true)
    expect(ld().models.count).toBe(true)
    expect(ld().global).toBe(true)

    await effect2
    expect(ld().effects.count.timeout1).toBe(false)
    expect(ld().effects.count.timeout2).toBe(false)
    expect(ld().models.count).toBe(false)
    expect(ld().global).toBe(false)
  })

  test('should configure the loading name to "foobar"', () => {
    const store = init({
      models: { count },
      plugins: [loadingPlugin({ name: 'foobar' })]
    })

    store.dispatch.count.addOne()
    expect(store.getState().foobar.global).toBe(false)
  })

  test('should throw if loading name is not a string', () => {
    const createStore = () => init({
      models: { count },
      plugins: [loadingPlugin({ name: 42 })]
    })

    expect(createStore).toThrow()
  })

  test('should block items if not in whitelist', () => {
    const store = init({
      models: { count },
      plugins: [loadingPlugin({
        whitelist: ['some/action'],
      })]
    })

    store.dispatch.count.timeout()
    expect(store.getState().loading.models.count).toBe(false)
  })

  test('should block items if in blacklist', () => {
    const store = init({
      models: { count },
      plugins: [loadingPlugin({
        blacklist: ['count/timeout'],
      })]
    })

    store.dispatch.count.timeout()
    expect(store.getState().loading.models.count).toBe(false)
  })

  test('should throw if whitelist is not an array', () => {
    const createStore = () => init({
      models: { count },
      plugins: [loadingPlugin({
        whitelist: 'some/action',
      })]
    })

    expect(createStore).toThrow()
  })

  test('should throw if blacklist is not an array', () => {
    const createStore = () => init({
      models: { count },
      plugins: [loadingPlugin({
        blacklist: 'some/action',
      })]
    })

    expect(createStore).toThrow()
  })

  test('should throw if contains both a whitelist & blacklist', () => {
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
    const count2 = {
      state: 0,
      effects: {
        throwError() {
          throw new Error('effect error')
        }
      }
    }
    const store = init({
      models: { count: count2 },
      plugins: [loadingPlugin()]
    })

    try {
      await store.dispatch.count.throwError()
    } catch (err) {
      expect(store.getState().loading.global).toBe(false)
    }
  })

  test('should trigger four actions', async () => {
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

    await store.dispatch.count.timeout()
    expect(actions).toEqual(['loading/show', 'count/timeout', 'count/addOne', 'loading/hide'])
  })

  test('should allow the propagation of the error', async () => {
    const count2 = {
        state: 0,
        effects: {
            throwError() {
                throw new Error('effect error')
            }
        }
    }
    const store = init({
        models: { count: count2 },
        plugins: [loadingPlugin()]
    })

    try {
        await store.dispatch.count.throwError()
    } catch (err) {
        expect(err.message).toBe('effect error')
    }
  })

  test('should allow the propagation of the meta object', async () => {
    const count2 = {
      state: 0,
      effects: {
        doSomething(payload, state, meta) {
          expect(meta).toEqual({ metaProp: 1 })
        }
      }
    }
    const store = init({
      models: { count: count2 },
      plugins: [loadingPlugin()]
    })

    try {
      await store.dispatch.count.doSomething(null, { metaProp: 1 })
    } catch (err) {
      throw err
    }
  })
})
