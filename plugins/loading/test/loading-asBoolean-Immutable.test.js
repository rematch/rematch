const { isImmutable, fromJS } = require('immutable')
const { combineReducers } = require('redux-immutable')
const { init } = require('../../../src')
const loadingPlugin = require('../src').default
const { delay, count, redux, loadingImmutable } = require('./utils')

xdescribe('loading asNumbers with Immutable', () => {
  test('loading.global should be false for normal dispatched action', () => {
    const store = init({
      models: { count },
      plugins: [loadingPlugin(loadingImmutable)],
      redux
    })

    store.dispatch.count.addOne()
    expect(store.getState().getIn(['loading','global'])).toBe(false)
  })

  test('loading.global should be true for a dispatched effect', () => {
    const store = init({
      models: { count },
      plugins: [loadingPlugin(loadingImmutable)],
      redux
    })

    store.dispatch.count.timeout()
    expect(store.getState().getIn(['loading','global'])).toBe(true)
  })

  test('loading.global should be true for two dispatched effects', () => {
    const store = init({
      models: { count },
      plugins: [loadingPlugin(loadingImmutable)],
      redux
    })

    store.dispatch.count.timeout()
    store.dispatch.count.timeout()
    expect(store.getState().getIn(['loading','global'])).toBe(true)
  })

  test('should set loading.models[name] to true', () => {
    const {
      init
    } = require('../../../src')
    const store = init({
      models: { count },
      plugins: [loadingPlugin(loadingImmutable)],
      redux
    })

    expect(store.getState().getIn(['loading','models','count'])).toBe(false)
  })

  test('should change the loading.models to true', () => {
    const store = init({
      models: { count },
      plugins: [loadingPlugin(loadingImmutable)],
      redux
    })

    store.dispatch.count.timeout()
    expect(store.getState().getIn(['loading','models','count'])).toBe(true)
  })

  test('should change the loading.models to true (double dispatch)', () => {
    const store = init({
      models: { count },
      plugins: [loadingPlugin(loadingImmutable)],
      redux
    })

    store.dispatch.count.timeout()
    store.dispatch.count.timeout()
    expect(store.getState().getIn(['loading','models','count'])).toBe(true)
  })

  test('should change the state (immutable objects should be different)', () => {
    const store = init({
      models: { count },
      plugins: [loadingPlugin(loadingImmutable)],
      redux
    })

    let state1 = store.getState().get('loading')
    store.dispatch.count.timeout()
    const state2 = store.getState().get('loading')
    expect(state1).not.toBe(state2)
  })

  test('should set loading.effects[name] to object of effects', () => {
    const store = init({
      models: { count },
      plugins: [loadingPlugin(loadingImmutable)],
      redux
    })
    expect(store.getState().getIn(['loading','effects','count','timeout'])).toBe(false)
  })

  test('should change the loading.effects to true', () => {
    const store = init({
      models: { count },
      plugins: [loadingPlugin(loadingImmutable)],
      redux
    })

    store.dispatch.count.timeout()
    expect(store.getState().getIn(['loading','effects','count','timeout'])).toBe(true)
  })

  test('should change the loading.effects to true (double dispatch)', () => {
    const store = init({
      models: { count },
      plugins: [loadingPlugin(loadingImmutable)],
      redux
    })

    store.dispatch.count.timeout()
    store.dispatch.count.timeout()
    expect(store.getState().getIn(['loading','effects','count','timeout'])).toBe(true)
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
      redux
    })

    const effect1 = store.dispatch.count.timeout1()
    await delay(100)
    const effect2 = store.dispatch.count.timeout2()

    const ld = () => store.getState().get('loading')
    expect(ld().getIn(['effects','count','timeout1'])).toBe(true)
    expect(ld().getIn(['effects','count','timeout2'])).toBe(true)
    expect(ld().getIn(['models','count'])).toBe(true)
    expect(ld().get('global')).toBe(true)

    await effect1
    expect(ld().getIn(['effects','count','timeout1'])).toBe(false)
    expect(ld().getIn(['effects','count','timeout2'])).toBe(true)
    expect(ld().getIn(['models','count'])).toBe(true)
    expect(ld().get('global')).toBe(true)

    await effect2
    expect(ld().getIn(['effects','count','timeout1'])).toBe(false)
    expect(ld().getIn(['effects','count','timeout2'])).toBe(false)
    expect(ld().getIn(['models','count'])).toBe(false)
    expect(ld().get('global')).toBe(false)
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
      expect(store.getState().getIn(['loading','global'])).toBe(false)
    }
  })

  test('should trigger four actions', async () => {
    let actions = []
    const store = init({
      models: { count },
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
      models: { count },
      plugins: [loadingPlugin({
        loadingActionCreator: 'should throw',
      })]
    })

    expect(createStore).toThrow()
  })

  test('should throw if config mergeInitialState is not a function', () => {
    const createStore = () => init({
      models: { count },
      plugins: [loadingPlugin({
        mergeInitialState: 'should throw',
      })]
    })

    expect(createStore).toThrow()
  })
})
