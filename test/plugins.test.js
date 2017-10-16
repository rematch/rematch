// Tests for consumer API
import { model, init, getStore, pluginExports, dispatch } from '../src/index'

beforeEach(() => {
  jest.resetModules()
})

describe('plugins:', () => {
  test('init should register a plugin', () => {
    init({
      plugins: [{
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
          console.log('dispatching', action.type)
          return next(action)
        }
      }]
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
      selectors: {
        double: s => s * 2
      }
    })

    dispatch.count.increment()

    const state = getStore().getState()

    expect(Object.keys(pluginExports)).toEqual(['selectors'])
    expect(pluginExports.selectors.count.double(state)).toEqual(6)
  })
})
