import { Config, PluginCreator } from '../typings/rematch'

export default (config: Config): Config =>
  (config.plugins || []).reduce((merged, plugin: PluginCreator) => {
    if (plugin.config) {
      // merges two config objects
      // assumes configs are already validated
      plugin.config.redux = plugin.config.redux || {}
      merged.redux = merged.redux || {}
      merged.models = merged.models || {}
      plugin.config.redux = plugin.config.redux || {}

      // add plugin models
      if (plugin.config.models) {
        Object.keys(plugin.config.models).forEach((modelName: string) => {
          merged.models[modelName] = plugin.config.models[modelName]
        })
      }

      // plugins
      merged.plugins = merged.plugins || []
      if (plugin.config.plugins) {
        merged.plugins = merged.plugins.concat(plugin.config.plugins)
      }

      // redux
      config.redux.initialState = config.redux.initialState || plugin.config.redux.initialState

      if (plugin.config.redux.reducers) {
        merged.redux.reducers = merged.redux.reducers || {}
        Object.keys(plugin.config.redux.reducers).forEach((reducerName: string) => {
          merged.redux.reducers[reducerName] = plugin.config.redux.reducers[reducerName]
        })
      }

      // Note: this pattern does not allow for multiple overwrites
      // of the same name. TODO: throw an error, or compose functions
      merged.redux.combineReducers = merged.redux.combineReducers || plugin.config.redux.combineReducers
      merged.redux.createStore = merged.redux.createStore || plugin.config.redux.createStore
    }
    return merged
  }, config)
