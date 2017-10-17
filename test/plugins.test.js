// Tests for consumer API
import { model, init, getStore, pluginExports } from '../src/index'

beforeEach(() => {
  jest.resetModules()
})

describe('plugins:', () => {
  xtest('init should register a plugin', () => {
    init()

    model({
      name: 'countA',
      state: 2,
      reducers: {
        increment: s => s + 1
      },
      effects: {
        asyncIncrement: async (payload, getState) => {
          pluginExports.dispatch.countA.increment()
        }
      },
      selectors: {
        double: s => s * 2
      },
      hooks: {
        'countB/increment': () => {
          pluginExports.dispatch.countA.increment()
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

    pluginExports.dispatch.countA.asyncIncrement()
    pluginExports.dispatch.countB.increment()

    const state = getStore().getState()

    expect(Object.keys(pluginExports)).toEqual([
      'dispatch',
      'effects',
      'select',
      'hooks',
      'patternHooks'
    ])
    expect(state).toEqual({
      countA: 4,
      countB: 1
    })
    expect(pluginExports.select.countA.double(state)).toEqual(8)
  })
})
