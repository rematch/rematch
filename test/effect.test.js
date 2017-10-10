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
})
