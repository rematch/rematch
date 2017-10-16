// Tests for consumer API
import { model, init, getStore, pluginExports } from '../src/index'

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
      onModel: (model, config, exports, dispatch) => {
        const createDispatcher = (modelName: string, reducerName: string) => (payload: any) => {
          const action = {
            type: `${modelName}/${reducerName}`,
            ...(payload ? { payload } : {})
          }
          dispatch(action)
        }

        Object.keys(model.effects2 || {}).forEach((effectName: string) => {
          exports.effects2[`${model.name}/${effectName}`] = model.effects2[effectName]
          // add effect to dispatch
          // is assuming dispatch2 is available already... that the dispatch plugin is in there
          exports.dispatch2[model.name][effectName] = createDispatcher(model.name, effectName)
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

    const dispatchPlugin = {
      onInit: () => ({
        name: 'dispatch2',
        val: {}
      }),
      onModel: (model, config, exports, dispatch) => {
        const createDispatcher = (modelName: string, reducerName: string) => (payload: any) => {
          const action = {
            type: `${modelName}/${reducerName}`,
            ...(payload ? { payload } : {})
          }
          dispatch(action)
        }

        exports.dispatch2[model.name] = {}
        Object.keys(model.reducers || {}).forEach((reducerName: string) => {
          exports.dispatch2[model.name][reducerName] = createDispatcher(model.name, reducerName)
        })
      }
    }

    init({
      plugins: [dispatchPlugin, effectsPlugin, selectorsPlugin]
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
      effects2: {
        asyncIncrement: async (payload, getState) => {
          pluginExports.dispatch2.count.increment()
        }
      },
      selectors: {
        double: s => s * 2
      }
    })

    pluginExports.dispatch2.count.asyncIncrement()

    const state = getStore().getState()

    expect(Object.keys(pluginExports)).toEqual(['dispatch2', 'effects2', 'selectors'])
    expect(pluginExports.selectors.count.double(state)).toEqual(6)
  })
})
