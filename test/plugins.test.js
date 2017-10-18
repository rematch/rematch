// Tests for consumer API
import { model, init, getStore, dispatch, select } from '../src/index'

beforeEach(() => {
  jest.resetModules()
})

describe('plugins:', () => {
  test('init should register a plugin', () => {
    init()

    model({
      name: 'countA',
      state: 2,
      reducers: {
        increment: s => s + 1
      },
      effects: {
        asyncIncrement: async () => {
          dispatch.countA.increment()
        }
      },
      selectors: {
        double: s => s * 2
      },
      hooks: {
        'countB/increment': () => {
          dispatch.countA.increment()
        }
      }
    })

    model({
      name: 'countB',
      state: 0,
      reducers: {
        increment: s => s + 1
      },
    })

    dispatch.countA.asyncIncrement()
    dispatch.countB.increment()

    const state = getStore().getState()

    expect(state).toEqual({
      countA: 4,
      countB: 1
    })
    expect(select.countA.double(state)).toEqual(8)
  })
})
