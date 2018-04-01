import { Config, PluginCreator } from '../../typings/rematch'
import validate from './validate'

const merge = <S>(original: any, next: any): any => {
  return (next) ? { ...next, ...(original || {}) } : original || {}
}

const isObject = (obj: object): boolean => (Array.isArray(obj) || typeof obj !== 'object')

/**
 * merge init configs together
 */
export default <S>(initConfig: Config = {}): Config => {
  const config = {
    models: {},
    plugins: [],
    ...initConfig,
    redux: {
      reducers: {},
      rootReducers: {},
      enhancers: [],
      middlewares: [],
      ...initConfig.redux,
    },
  }

  if (process.env.NODE_ENV !== 'production') {
    validate([
      [
        !Array.isArray(config.plugins),
        'init config.plugins must be an array',
      ],
      [
        isObject(config.models),
        'init config.models must be an object',
      ],
      [
        isObject(config.redux.reducers),
        'init config.redux.reducers must be an object',
      ],
      [
        !Array.isArray(config.redux.middlewares),
        'init config.redux.middlewares must be an array',
      ],
      [
        !Array.isArray(config.redux.enhancers),
        'init config.redux.enhancers must be an array of functions',
      ],
      [
        config.redux.combineReducers && typeof config.redux.combineReducers !== 'function',
        'init config.redux.combineReducers must be a function',
      ],
      [
        config.redux.createStore && typeof config.redux.createStore !== 'function',
        'init config.redux.createStore must be a function',
      ],
    ])
  }

  // defaults
  for (const plugin of config.plugins || []) {
    if (plugin.config) {

      // models
      config.models =
        merge(config.models, plugin.config.models) as typeof config.models // FIXME: not sure how to avoid this

      // plugins
      if (plugin.config.plugins) {
        config.plugins = config.plugins.concat(plugin.config.plugins)
      }

      // redux
      if (plugin.config.redux) {
        config.redux.initialState = merge(config.redux.initialState, plugin.config.redux.initialState)
        config.redux.reducers = merge(config.redux.reducers, plugin.config.redux.reducers)
        config.redux.rootReducers = merge(config.redux.rootReducers, plugin.config.redux.reducers)
        if (plugin.config.redux.enhancers) {
          config.redux.enhancers = config.redux.enhancers.concat(plugin.config.redux.enhancers)
        }
        if (plugin.config.redux.middlewares) {
          config.redux.middlewares = config.redux.middlewares.concat(plugin.config.redux.middlewares)
        }
        config.redux.combineReducers = config.redux.combineReducers || plugin.config.redux.combineReducers
        config.redux.createStore = config.redux.createStore || plugin.config.redux.createStore
      }
    }
  }
  return config
}
