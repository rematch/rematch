// Tests for consumer API
import { model, init, getStore, pluginExports } from '../src/index'

beforeEach(() => {
  jest.resetModules()
})

describe('plugins:', () => {
  test('init should register a plugin', () => {

    const selectorsPlugin = {
      onInit: () => [{
        name: 'selectors',
        val: {}
      }],
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
      onInit: () => [{
        name: 'effects2',
        val: {}
      }],
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
      onInit: () => [{
        name: 'dispatch2',
        val: {}
      }],
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

    const hooksPlugin = {
      onInit: () => [{
        name: 'hooks2',
        val: new Map()
      }, {
        name: 'patternHooks2',
        val: new Map()
      }],
      onModel: (model, config, exports, dispatch) => {
        // matches actions with letter/number characters & -, _
        const actionRegex = /^[A-Za-z0-9-_]+\/[A-Za-z0-9-_]+$/
        const isPatternMatch = matcher => !!matcher.match(actionRegex)
        const createHook = (
          matcher: string,
          onAction: (action: $action) => void
        ) => {
          if (typeof matcher !== 'string') {
            throw new Error('hook matcher must be a string')
          }
          if (typeof onAction !== 'function') {
            throw new Error('hook onAction must be a function')
          }
          if (isPatternMatch(matcher)) {
            exports.patternHooks2.set(matcher, onAction)
          } else {
            // set as a pattern hook, if hook does not match a specific action
            exports.hooks2.set(matcher, onAction)
          }
        }

        Object.keys(model.hooks2 || {}).forEach((matcher: string) => {
          createHook(matcher, model.hooks2[matcher])
        })
      },
      middleware: store => next => action => {
        const matchHooks = (action: $action): void => {
          const { type } = action
          // exact match
          if (pluginExports.hooks2.has(type)) {
            pluginExports.hooks2.get(type)(action)
          } else {
            // run matches on pattern hooks
            pluginExports.patternHooks2.forEach((value: (action: $action) => void, key: string) => {
              if (type.match(new RegExp(key))) {
                value(action)
              }
            })
          }
        }

        let result = next(action)

        matchHooks(action)

        return result
      }
    }

    init({
      plugins: [dispatchPlugin, effectsPlugin, selectorsPlugin, hooksPlugin]
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
