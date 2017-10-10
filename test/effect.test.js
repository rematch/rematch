import { model, init, dispatch } from '../src/index'
import { effect } from '../src/effect'
import { _store } from '../src/store'

beforeEach(() => {
  jest.resetModules()
})

describe('effect:', () => {
  test('should create an action', () => {
    init()

    model({
      name: 'count',
      state: 0,
      effect: {
        add: () => 1,
      },
    })

    expect(typeof dispatch.count.add).toBe('function')
  })

  test('should create an effect', () => {
    init()

    model({
      name: 'example',
      state: 0,
      effect: {
        add: () => 1,
      },
    })

    expect(effect).toEqual({
      add: () => 1,
    })
  })

  test('should be able to trigger another action', async () => {
    init()

    model({
      name: 'example',
      state: 0,
      reduce: {
        addOne: (state) => state + 1,
      },
      effect: {
        asyncAddOne: async () => {
          await dispatch.example.addOne()
        }
      }
    })

    await dispatch.asyncAddOne()

    expect(_store.getState()).toEqual({
      example: 1,
    })
  })

  test('should be able to trigger another action with a value', async () => {
    init()

    model({
      name: 'example',
      state: 2,
      reduce: {
        addBy: (state, { payload }) => state + payload,
      },
      effect: {
        asyncAddBy: async (value) => {
          await dispatch.example.addBy(value)
        }
      }
    })

    await dispatch.asyncAddBy(5)

    expect(_store.getState()).toEqual({
      example: 7,
    })
  })

  test('should be able to trigger another action w/ an object value', async () => {
    init()

    model({
      name: 'example',
      state: 3,
      reduce: {
        addBy: (state, { payload }) => state + payload.value,
      },
      effect: {
        asyncAddBy: async (value) => {
          await dispatch.example.addBy(value)
        }
      }
    })

    await dispatch.asyncAddBy({ value: 6 })

    expect(_store.getState()).toEqual({
      example: 9,
    })
  })

  test('should be able to trigger another action w/ another action', async () => {
    init()
  
    model({
      name: 'example',
      state: 0,
      reduce: {
        addOne: (state) => state + 1,
      },
      effect: {
        asyncAddOne: async () => {
          await dispatch.example.addOne()
        },
        asyncCallAddOne: async () => {
          await dispatch.example.asyncAddOne()
        }
      }
    })

    await dispatch.asyncCallAddOne()

    expect(_store.getState()).toEqual({
      example: 1,
    })
  })

  test('should be able to trigger another action w/ multiple actions', async () => {
    init()

    model({
      name: 'example',
      state: 0,
      reduce: {
        addBy: (state, payload) => state + payload,
      },
      effect: {
        asyncAddOne: async () => {
          await dispatch.example.addBy(1)
        },
        asyncAddThree: async () => {
          await dispatch.example.addBy(3)
        },
        asyncAddSome: async () => {
          await dispatch.example.asyncAddThree()
          await dispatch.example.asyncAddOne()
          await dispatch.example.asyncAddOne()
        }
      }
    })

    await dispatch.asyncAddSome()

    expect(_store.getState()).toEqual({
      example: 5,
    })
  })
})
