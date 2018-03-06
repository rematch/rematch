import { Config, PluginCreator } from '../../typings/rematch'

function merge<S>(original: any, next: any): any {
  return (next) ? { ...next, ...(original || {}) } : original || {}
}

// merges init config with plugin configs
export default <S>(config: Config<S>): Config<S> => {
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
