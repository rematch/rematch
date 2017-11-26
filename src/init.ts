import validate from './utils/validate'
import isObject from './utils/isObject'
import mergeConfig from './utils/mergeConfig'
import getExposed from './utils/getExposed'
import buildPlugins from './utils/buildPlugins'
import getModels from './utils/getModels'
import { preStore, postStore } from './core'
import corePlugins from './plugins'
import { initModelHooks } from './model'
import { initStore } from './redux/store'
import { initReducers } from './redux/reducers'

const validateConfig = (config: config) =>
  validate([
    [
      config.plugins && !Array.isArray(config.plugins),
      'init config.plugins must be an array',
    ],
    [
      config.models && isObject(config.models),
      'init config.models must be an object'
    ],
    [
      config.redux.middlewares && !Array.isArray(config.redux.middlewares),
      'init config.redux.middlewares must be an array',
    ],
    [
      config.redux.reducers && isObject(config.redux.reducers),
      'init config.redux.reducers must be an object',
    ],
    [
      config.redux.combineReducers && typeof config.redux.combineReducers !== 'function',
      'init config.redux.combineReducers must be a function'
    ],
    [
      config.redux.createStore && typeof config.redux.createStore !== 'function',
      'init config.redux.createStore must be a function'
    ],
  ])

const init = (initConfig: config = {}): void => {
  initConfig.redux = initConfig.redux || {}
  validateConfig(initConfig)
  const config = mergeConfig(initConfig)
  const pluginConfigs = corePlugins.concat(config.plugins || [])
  const exposed = getExposed(pluginConfigs)
  const plugins = buildPlugins(pluginConfigs, exposed)

  // preStore: middleware, model hooks
  preStore(plugins)

  // collect all models
  const models = getModels(config, plugins)
  initModelHooks(models)
  initReducers(models, config.redux)

  // create a redux store with initialState
  // merge in additional extra reducers
  initStore(config)

  postStore(plugins)
}

export default init
