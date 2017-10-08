import { model, init, dispatch } from '../src/index'
import { _store } from '../src/store'

beforeEach(() => {
  jest.resetModules()
})

describe('dispatch:', () => {
  test('should dispatch an action', () => {
    init({ view: () => () => {} })

    model({
      name: 'count',
      state: 0,
      reduce: {
        add: state => state + 1,
      },
    })

    dispatch.count.add()

    expect(_store.getState()).toEqual({
      count: 1,
    })
  })

  test('should dispatch multiple actions', () => {
    init({ view: () => () => {} })

    model({
      name: 'count',
      state: 0,
      reduce: {
        add: state => state + 1,
      },
    })

    dispatch.count.add()
    dispatch.count.add()

    expect(_store.getState()).toEqual({
      count: 2,
    })
  })

  test('should handle multiple models', () => {
    init({ view: () => () => {} })

    model({
      name: 'a',
      state: 42,
      reduce: {
        add: state => state + 1,
      },
    })

    model({
      name: 'b',
      state: 0,
      reduce: {
        add: state => state + 1,
      },
    })

    dispatch.a.add()
    dispatch.b.add()

    expect(_store.getState()).toEqual({
      a: 43,
      b: 1,
    })
  })

  test('should dispatch an action with payload as 2nd argument', () => {
    init({ view: () => () => {} })

    model({
      name: 'count',
      state: 5,
      reduce: {
        upBy: (state, payload) => state + payload.amount,
      },
    })

    dispatch.count.upBy({ amount: 5 })

    expect(_store.getState()).toEqual({
      count: 10,
    })
  })
})
