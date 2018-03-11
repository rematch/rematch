import { Config, PluginCreator } from '../../typings/rematch'
import isObject from './isObject'
import validate from './validate'

function merge<S>(original: any, next: any): any {
  return (next) ? { ...next, ...(original || {}) } : original || {}
}

// merges init config with plugin configs
export default <S>(config: Config<S> = {}): Config<S> => {
  config.redux = config.redux || {}
  if (process.env.NODE_ENV !== 'production') {
      validate([
        [
          config.plugins && !Array.isArray(config.plugins),
          'init config.plugins must be an array',
        ],
        [
          config.models && isObject(config.models),
          'init config.models must be an object',
        ],
        [
          config.redux.reducers
          && isObject(config.redux.reducers),
          'init config.redux.reducers must be an object',
        ],
        [
          config.redux.middlewares && !Array.isArray(config.redux.middlewares),
          'init config.redux.middlewares must be an array',
        ],
        [
          config.redux.enhancers
          && !Array.isArray(config.redux.enhancers),
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
  config.models = config.models || {}

  // defaults
  const plugins = config.plugins || []
  return (plugins).reduce((merged: Config<S>, plugin: PluginCreator<S>): Config<S> => {
    if (plugin.config) {

      // models
      merged.models =
        merge(merged.models, plugin.config.models) as typeof merged.models // FIXME: not sure how to avoid this

      // plugins
      if (plugin.config.plugins) {
        merged.plugins = merged.plugins.concat(plugin.config.plugins)
      }

      // redux
      if (plugin.config.redux) {
        merged.redux.initialState = merge(merged.redux.initialState, plugin.config.redux.initialState)
        merged.redux.reducers = merge(merged.redux.reducers, plugin.config.redux.reducers)
        merged.redux.rootReducers = merge(merged.redux.rootReducers, plugin.config.redux.reducers)
        if (plugin.config.redux.enhancers) {
          merged.redux.enhancers = merged.redux.enhancers.concat(plugin.config.redux.enhancers)
        }
        merged.redux.combineReducers = merged.redux.combineReducers || plugin.config.redux.combineReducers
        merged.redux.createStore = merged.redux.createStore || plugin.config.redux.createStore
      }
    }
    return merged
  }, config)
}
