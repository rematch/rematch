import { model, init, dispatch, getStore } from '../src/index'

beforeEach(() => {
  jest.resetModules()
})

describe('dispatch:', () => {
  test('should call dispatch directly', () => {
    init()

    model({
      name: 'count',
      state: 0,
      reducers: {
        add: state => state + 1,
      },
    })

    dispatch({ type: 'count/add' })

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

    dispatch.count.add()

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

    dispatch.count.add()
    dispatch.count.add()

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

    dispatch.a.add()
    dispatch.b.add()

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

    dispatch.count.doNothing()

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
        incrementBy: (state, payload) => {
          console.log('state/payload', state, payload)
          return state + payload
        },
      },
    })

    dispatch.count.incrementBy(5)

    expect(getStore().getState()).toEqual({
      count: 6,
    })
  })
})
