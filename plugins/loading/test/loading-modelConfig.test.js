const { init } = require('../../../src')
const loadingPlugin = require('../src').default
const { delay, count } = require('./utils')

xdescribe('loading model', () => {
  it('should accept custom selector', () => {
    const { select } = require('@rematch/select')
    const selectPlugin = require('@rematch/select').default
    const store = init({
      models: { count },
      plugins: [
        loadingPlugin({
          model: {
            selectors: {
              timeoutLoading(state) { return state.effects.count.timeout }
            }
          }
        }),
        selectPlugin()
      ]
    })

    store.dispatch.count.timeout()
    expect(select.loading.timeoutLoading(store.getState())).toBe(true)
  })

  test('should accept custom reducer', () => {
    const store = init({
      models: { count },
      plugins: [loadingPlugin({ model: { reducers: {
        custom: (state, payload) => ({ ...state, custom: payload })
      } }})]
    })

    store.dispatch.loading.custom('foobar')
    expect(store.getState().loading.custom).toBe('foobar')
  })

  test('should capture all simultaneous effects when reducers overloaded', async () => {
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
      plugins: [loadingPlugin({ model: { reducers: {
        hide: (state, payload) => state,
        show: (state, payload) => state,
      } } } )]
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

  test('should configure the loading name to "foobar" when model.name is different than name config', () => {
    const store = init({
      models: { count },
      plugins: [loadingPlugin({ name: 'foobar', model: { name: 'not foobar' } })]
    })

    store.dispatch.count.addOne()
    expect(store.getState().foobar.global).toBe(false)
  })

  test('should configure the loading name to "foobar" when model.name is set', () => {
    const store = init({
      models: { count },
      plugins: [loadingPlugin({ model: { name: 'foobar' } })]
    })

    store.dispatch.count.addOne()
    expect(store.getState().foobar.global).toBe(false)
  })

  test('should throw if loading model.name is not a string', () => {
    const createStore = () => init({
      models: { count },
      plugins: [loadingPlugin({ model: { name: 42 } })]
    })

    expect(createStore).toThrow()
  })

  test('should throw if config model is not an object', () => {
    const createStore = () => init({
      models: { count },
      plugins: [loadingPlugin({
        model: 'should throw',
      })]
    })

    expect(createStore).toThrow()
  })
})
