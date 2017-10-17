import { model, init, getStore, pluginExports } from '../src/index'

beforeEach(() => {
  jest.resetModules()
})

describe('dispatch:', () => {
  xtest('should be able to call dispatch directly', () => {
    init()

    model({
      name: 'count',
      state: 0,
      reducers: {
        add: state => state + 1,
      },
    })

    pluginExports.dispatch({ type: 'count/add' })

    expect(getStore().getState()).toEqual({
      count: 1,
    })
  })

  test('should dispatch an action', () => {
    init()

    model({
      name: 'count',
      state: 0,
      reducers: {
        add: state => state + 1,
      },
    })

    pluginExports.dispatch.count.add()

    expect(getStore().getState()).toEqual({
      count: 1,
    })
  })

  test('should dispatch multiple actions', () => {
    init()

    model({
      name: 'count',
      state: 0,
      reducers: {
        add: state => state + 1,
      },
    })

    pluginExports.dispatch.count.add()
    pluginExports.dispatch.count.add()

    expect(getStore().getState()).toEqual({
      count: 2,
    })
  })

  test('should handle multiple models', () => {
    init()

    model({
      name: 'a',
      state: 42,
      reducers: {
        add: state => state + 1,
      },
    })

    model({
      name: 'b',
      state: 0,
      reducers: {
        add: state => state + 1,
      },
    })

    pluginExports.dispatch.a.add()
    pluginExports.dispatch.b.add()

    expect(getStore().getState()).toEqual({
      a: 43,
      b: 1,
    })
  })

  it('should be called from an dispatch action type', () => {
    init()

    model({
      name: 'count',
      state: 0,
      reducers: {
        add: state => state + 1,
      },
    })

    getStore().dispatch({ type: 'count/add' })

    expect(getStore().getState()).toEqual({
      count: 1,
    })
  })

  test('should handle state as the first param', () => {
    init()

    model({
      name: 'count',
      state: 0,
      reducers: {
        doNothing: state => state,
      },
    })

    pluginExports.dispatch.count.doNothing()

    expect(getStore().getState()).toEqual({
      count: 0,
    })
  })

  test('should handle payload as the second param', () => {
    init()

    model({
      name: 'count',
      state: 1,
      reducers: {
        incrementBy: (state, payload) => state + payload,
      },
    })

    pluginExports.dispatch.count.incrementBy(5)

    expect(getStore().getState()).toEqual({
      count: 6,
    })
  })
})
