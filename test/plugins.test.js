// Tests for consumer API
import { model, init, getStore, pluginExports, dispatch } from '../src/index'

beforeEach(() => {
  jest.resetModules()
})

describe('plugins:', () => {
  test('init should register a plugin', () => {

    const selectorsPlugin = {
      onInit: () => ({
        name: 'selectors',
        val: {}
      }),
      onModel: (model, config, exports) => {
        exports.selectors[model.name] = {}
        Object.keys(model.selectors || {}).forEach((selectorName: string) => {
          exports.selectors[model.name][selectorName] = (state: any, ...args) =>
            model.selectors[selectorName](state[model.name], ...args)
        })
      },
      middleware: store => next => action => {
        // console.log('dispatching', action.type)
        return next(action)
      }
    }

    const effectsPlugin = {
      onInit: () => ({
        name: 'effects2',
        val: {}
      }),
      onModel: (model, config, exports) => {
        Object.keys(model.effects2 || {}).forEach((effectName: string) => {
          exports.effects2[`${model.name}/${effectName}`] = model.effects2[effectName]
          // add effect to dispatch
          // dispatch[model.name][effectName] = createDispatcher(model.name, effectName)
        })
      },
      middleware: store => next => action => {
        let result = next(action)

        if (action.type in pluginExports.effects2) {
          result = pluginExports.effects2[action.type](action.payload, store.getState)
        }

        return result
      }
    }

    init({
      plugins: [effectsPlugin, selectorsPlugin]
    })

    model({
      name: 'app',
      state: 'Hello, world',
    })

    model({
      name: 'count',
      state: 2,
      reducers: {
        increment: s => s + 1
      },
      effects: {
        asyncIncrement: async (payload, getState) => {
          dispatch.count.increment()
        }
      },
      selectors: {
        double: s => s * 2
      }
    })

    dispatch.count.asyncIncrement()

    const state = getStore().getState()

    expect(Object.keys(pluginExports)).toEqual(['effects2', 'selectors'])
    expect(pluginExports.selectors.count.double(state)).toEqual(6)
  })
})
