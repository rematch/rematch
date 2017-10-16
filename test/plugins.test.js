// Tests for consumer API
import { model, init, getStore, pluginExports } from '../src/index'
import selectorsPlugin from '../src/plugins/selectors'
import dispatchPlugin from '../src/plugins/dispatch'
import effectsPlugin from '../src/plugins/effects'
import hooksPlugin from '../src/plugins/hooks'

beforeEach(() => {
  jest.resetModules()
})

describe('plugins:', () => {
  test('init should register a plugin', () => {

    init({
      plugins: [dispatchPlugin, effectsPlugin(pluginExports), selectorsPlugin, hooksPlugin(pluginExports)]
    })

    model({
      name: 'countA',
      state: 2,
      reducers: {
        increment: s => s + 1
      },
      effects2: {
        asyncIncrement: async (payload, getState) => {
          pluginExports.dispatch2.countA.increment()
        }
      },
      selectors: {
        double: s => s * 2
      },
      hooks2: {
        'countB/increment': () => {
          pluginExports.dispatch2.countA.increment()
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

    pluginExports.dispatch2.countA.asyncIncrement()
    pluginExports.dispatch2.countB.increment()

    const state = getStore().getState()

    expect(Object.keys(pluginExports)).toEqual([
      'dispatch2',
      'effects2',
      'selectors',
      'hooks2',
      'patternHooks2'
    ])
    expect(state).toEqual({
      countA: 4,
      countB: 1
    })
    expect(pluginExports.selectors.countA.double(state)).toEqual(8)
  })
})
