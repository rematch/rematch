import { model, init, dispatch, getStore } from '../src/index'
import { effects } from '../src/effects'

beforeEach(() => {
  jest.resetModules()
})

describe('effects:', () => {
  test('should create an action', () => {
    init()

    model({
      name: 'count',
      state: 0,
      effects: {
        add: () => 1,
      },
    })

    expect(typeof dispatch.count.add).toBe('function')
  })

  test('should create an effects', () => {
    init()

    const add = () => 1

    model({
      name: 'example',
      state: 0,
      effects: {
        add,
      },
    })

    expect(effects['example/add']).toEqual(add)
  })

  test('should be able to trigger another action', async () => {
    init()

    model({
      name: 'example',
      state: 0,
      reducers: {
        addOne: (state) => state + 1,
      },
      effects: {
        asyncAddOne: async () => {
          await dispatch.example.addOne()
        }
      }
    })

    await dispatch.example.asyncAddOne()

    expect(getStore().getState()).toEqual({
      example: 1,
    })
  })

  test('should be able to trigger another action with a value', async () => {
    init()

    model({
      name: 'example',
      state: 2,
      reducers: {
        addBy: (state, payload) => state + payload,
      },
      effects: {
        asyncAddBy: async (value) => {
          await dispatch.example.addBy(value)
        }
      }
    })

    await dispatch.example.asyncAddBy(5)

    expect(getStore().getState()).toEqual({
      example: 7,
    })
  })

  test('should be able to trigger another action w/ an object value', async () => {
    init()

    model({
      name: 'example',
      state: 3,
      reducers: {
        addBy: (state, payload) => state + payload.value,
      },
      effects: {
        asyncAddBy: async (value) => {
          await dispatch.example.addBy(value)
        }
      }
    })

    await dispatch.example.asyncAddBy({ value: 6 })

    expect(getStore().getState()).toEqual({
      example: 9,
    })
  })

  test('should be able to trigger another action w/ another action', async () => {
    init()

    model({
      name: 'example',
      state: 0,
      reducers: {
        addOne: (state) => state + 1,
      },
      effects: {
        asyncAddOne: async () => {
          await dispatch.example.addOne()
        },
        asyncCallAddOne: async () => {
          await dispatch.example.asyncAddOne()
        }
      }
    })

    await dispatch.example.asyncCallAddOne()

    expect(getStore().getState()).toEqual({
      example: 1,
    })
  })
})
