import { Config, PluginCreator } from '../typings/rematch'

const merge = (original: object, next: object): any => {
  return (next) ? { ...next, ...(original || {}) } : original || {}
}

export default (config: Config): Config =>
  (config.plugins || []).reduce((merged, plugin: PluginCreator) => {
    if (plugin.config) {
      // merges two config objects
      // assumes configs are already validated
      merged.redux = merged.redux || {}
      plugin.config.redux = plugin.config.redux || {}
      merged.models = merged.models || {}
      merged.plugins = merged.plugins || []

      // merge plugin models
      merged.models = merge(merged.models, plugin.config.models)

      // plugins
      if (plugin.config.plugins) {
        merged.plugins = merged.plugins.concat(plugin.config.plugins)
      }

      // redux
      merged.redux.initialState = merge(merged.redux.initialState, plugin.config.redux.initialState)
      merged.redux.reducers = merge(merged.redux.reducers, plugin.config.redux.reducers)
      // overwrites
      merged.redux.combineReducers = merged.redux.combineReducers || plugin.config.redux.combineReducers
      merged.redux.createStore = merged.redux.createStore || plugin.config.redux.createStore
    }
    return merged
  }, config)
