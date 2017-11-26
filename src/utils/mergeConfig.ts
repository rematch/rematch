import { Config, PluginCreator } from '../typings/rematch'

// merges two config objects
// assumes configs are already validated
export const mergeConfig = (c1: Config = {}, c2: Config = {}): Config => {
  c1.redux = c1.redux || {}
  c2.redux = c2.redux || {}
  const config: Config = {
    models: {},
    plugins: [],
    redux: {},
  }

  // models
  if (c1.models) {
    config.models = Object.keys(c1.models).reduce((a, b) => {
      const model = c1.models[b]
      return {
        [model.name]: model,
        ...a,
      }
    }, c2.models || {})
  }

  // plugins
  config.plugins = c1.plugins || []
  if (c2.plugins) {
    c2.plugins.forEach((plugin: PluginCreator) => {
      if (!config.plugins.includes(plugin)) {
        config.plugins.push(plugin)
      }
    })
  }

  // redux

  // initialState
  config.redux.initialState = c1.redux.initialState || {}
  if (c2.redux.initialState) {
    config.redux.initialState = {
      ...c1.redux.initialState,
      ...c2.redux.initialState,
    }
  }

  config.redux.reducers = c1.redux.reducers || {}
  if (c2.redux.reducers) {
    config.redux.reducers = {
      ...c1.redux.reducers,
      ...c2.redux.reducers,
    }
  }

  // Note: this pattern does not allow for multiple overwrites
  // of the same name. TODO: throw an error, or compose functions
  config.redux.combineReducers = c2.redux.combineReducers || c1.redux.combineReducers
  config.redux.createStore = c2.redux.createStore || c1.redux.createStore

  return config
}

export default (config: Config): Config => (config.plugins || []).reduce((a, b) => {
  if (b.config) {
    b.config.redux = b.config.redux || {}
    return mergeConfig(a, b.config)
  }
  return a
}, config)
