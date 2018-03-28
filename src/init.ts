import { Store } from 'redux'
import { Config, ConfigRedux, Exposed } from '../typings/rematch'
import { postStore, preStore } from './core'
import { initModelHooks } from './model'
import corePlugins from './plugins'
import { initReducers } from './redux/reducers'
import { initStore } from './redux/store'
import buildPlugins from './utils/buildPlugins'
import getActionCreators from './utils/getActionCreators'
import getExposed from './utils/getExposed'
import getModels from './utils/getModels'
import isObject from './utils/isObject'
import mergeConfig from './utils/mergeConfig'
import validate from './utils/validate'

const init = (config: Config | undefined = {}): Store<any> => {
  config = {
    ...config,
    models: config.models || {},
    redux: config.redux || {},
  }

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

  config = {
    ...config,
    redux: {
      ...config.redux,
      devtoolOptions: {
        // We use our devtool options before spreading the user's
        // configured devtool options so that they can override ours
        actionCreators: getActionCreators(config.models),
        ...config.redux.devtoolOptions || {},
      },
    },
  }

  const mergedConfig = mergeConfig(config)
  const pluginConfigs = corePlugins.concat(mergedConfig.plugins || [])
  const exposed: Exposed = getExposed(pluginConfigs)
  const plugins = buildPlugins(pluginConfigs, exposed)

  // preStore: middleware, model hooks
  preStore(plugins)

  // collect all models
  const models = getModels(mergedConfig.models)
  initModelHooks(models)
  initReducers(models, mergedConfig.redux)

  // create a redux store with initialState
  // merge in additional extra reducers
  const store: Store<any> = initStore(mergedConfig)
  postStore(plugins, store)

  // use plugin dispatch as store.dispatch
  store.dispatch = corePlugins[0].expose.dispatch

  return store
}

export default init
