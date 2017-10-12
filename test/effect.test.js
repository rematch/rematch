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

    const add = () => 1

    model({
      name: 'example',
      state: 0,
      effect: {
        add,
      },
    })

    expect(effect['example/add']).toEqual(add)
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

    await dispatch.example.asyncAddOne()

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
        addBy: (state, payload) => state + payload,
      },
      effect: {
        asyncAddBy: async (value) => {
          await dispatch.example.addBy(value)
        }
      }
    })

    await dispatch.example.asyncAddBy(5)

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
        addBy: (state, payload) => state + payload.value,
      },
      effect: {
        asyncAddBy: async (value) => {
          await dispatch.example.addBy(value)
        }
      }
    })

    await dispatch.example.asyncAddBy({ value: 6 })

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

    await dispatch.example.asyncCallAddOne()

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

    await dispatch.example.asyncAddSome()

    expect(_store.getState()).toEqual({
      example: 5,
    })
  })
})
