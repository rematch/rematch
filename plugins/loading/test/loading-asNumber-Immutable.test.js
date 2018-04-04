const { init } = require('../../../src')
const loadingPlugin = require('../src').default
const { delay, countModelMaker, redux, loadingImmutableConfigMaker } = require('./utils')

const loadingImmutable = loadingImmutableConfigMaker({ asNumber: true })

describe('loading asNumber with Immutable', () => {
  test('loading.global should be 0 for normal dispatched action', () => {
    const store = init({
      models: { count: countModelMaker() },
      plugins: [loadingPlugin(loadingImmutable)],
      redux
    })

    store.dispatch.count.addOne()
    expect(store.getState().getIn(['loading','global'])).toBe(0)
  })

  test('loading.global should be 1 for a dispatched effect', () => {
    const store = init({
      models: { count: countModelMaker() },
      plugins: [loadingPlugin(loadingImmutable)],
      redux
    })

    store.dispatch.count.timeout()
    expect(store.getState().getIn(['loading','global'])).toBe(1)
  })

  test('loading.global should be 2 for two dispatched effects', () => {
    const store = init({
      models: { count: countModelMaker() },
      plugins: [loadingPlugin(loadingImmutable)],
      redux
    })

    store.dispatch.count.timeout()
    store.dispatch.count.timeout()
    expect(store.getState().getIn(['loading','global'])).toBe(2)
  })

  test('should set loading.models[name] to 0', () => {
    const {
      init
    } = require('../../../src')
    const store = init({
      models: { count: countModelMaker() },
      plugins: [loadingPlugin(loadingImmutable)],
      redux
    })

    expect(store.getState().getIn(['loading','models','count'])).toBe(0)
  })

  test('should change the loading.models to 1', () => {
    const store = init({
      models: { count: countModelMaker() },
      plugins: [loadingPlugin(loadingImmutable)],
      redux
    })

    store.dispatch.count.timeout()
    expect(store.getState().getIn(['loading','models','count'])).toBe(1)
  })

  test('should change the loading.models to 2', () => {
    const store = init({
      models: { count: countModelMaker() },
      plugins: [loadingPlugin(loadingImmutable)],
      redux
    })

    store.dispatch.count.timeout()
    store.dispatch.count.timeout()
    expect(store.getState().getIn(['loading','models','count'])).toBe(2)
  })

  test('should change the state (immutable objects should be different)', () => {
    const store = init({
      models: { count: countModelMaker() },
      plugins: [loadingPlugin(loadingImmutable)],
      redux
    })

    const state1 = store.getState().get('loading')
    store.dispatch.count.timeout()
    const state2 = store.getState().get('loading')
    expect(state1).not.toBe(state2)
  })

  test('should set loading.effects[name] to object of effects', () => {
    const store = init({
      models: { count: countModelMaker() },
      plugins: [loadingPlugin(loadingImmutable)],
      redux
    })
    expect(store.getState().getIn(['loading','effects','count','timeout'])).toBe(0)
  })

  test('should change the loading.effects to 1', () => {
    const store = init({
      models: { count: countModelMaker() },
      plugins: [loadingPlugin(loadingImmutable)],
      redux
    })

    store.dispatch.count.timeout()
    expect(store.getState().getIn(['loading','effects','count','timeout'])).toBe(1)
  })

  test('should change the loading.effects to 2', () => {
    const store = init({
      models: { count: countModelMaker() },
      plugins: [loadingPlugin(loadingImmutable)],
      redux
    })

    store.dispatch.count.timeout()
    store.dispatch.count.timeout()
    expect(store.getState().getIn(['loading','effects','count','timeout'])).toBe(2)
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
      plugins: [loadingPlugin(loadingImmutable)],
      redux,
    })

    const effect1 = store.dispatch.count.timeout1()
    await delay(100)
    const effect2 = store.dispatch.count.timeout2()

    const ld = () => store.getState().get('loading')
    expect(ld().getIn(['effects','count','timeout1'])).toBe(1)
    expect(ld().getIn(['effects','count','timeout2'])).toBe(1)
    expect(ld().getIn(['models','count'])).toBe(2)
    expect(ld().get('global')).toBe(2)

    await effect1
    expect(ld().getIn(['effects','count','timeout1'])).toBe(0)
    expect(ld().getIn(['effects','count','timeout2'])).toBe(1)
    expect(ld().getIn(['models','count'])).toBe(1)
    expect(ld().get('global')).toBe(1)

    await effect2
    expect(ld().getIn(['effects','count','timeout1'])).toBe(0)
    expect(ld().getIn(['effects','count','timeout2'])).toBe(0)
    expect(ld().getIn(['models','count'])).toBe(0)
    expect(ld().get('global')).toBe(0)
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
      plugins: [loadingPlugin(loadingImmutable)],
      redux
    })

    try {
      await store.dispatch.count.throwError()
    } catch (err) {
      expect(store.getState().getIn(['loading','global'])).toBe(0)
    }
  })

  test('should trigger four actions', async () => {
    let actions = []
    const store = init({
      models: { count: countModelMaker() },
      plugins: [loadingPlugin(loadingImmutable)],
      redux: {
        ...redux,
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
        plugins: [loadingPlugin(loadingImmutable)],
        redux,
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
      plugins: [loadingPlugin(loadingImmutable)],
      redux,
    })

    try {
      await store.dispatch.count.doSomething(null, { metaProp: 1 })
    } catch (err) {
      throw err
    }
  })

  test('should throw if config loadingActionCreator is not a function', () => {
    const createStore = () => init({
      models: { count: countModelMaker() },
      plugins: [loadingPlugin({
        loadingActionCreator: 'should throw',
      })]
    })

    expect(createStore).toThrow()
  })

  test('should throw if config mergeInitialState is not a function', () => {
    const createStore = () => init({
      models: { count: countModelMaker() },
      plugins: [loadingPlugin({
        mergeInitialState: 'should throw',
      })]
    })

    expect(createStore).toThrow()
  })
})
