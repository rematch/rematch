// @flow
import createModel from './model'
import corePlugins from './plugins'
import { createStore, getStore } from './redux/store'
import validate from './utils/validate'
import mergeConfig from './utils/mergeConfig'

export const modelHooks = []
export const pluginMiddlewares = []

const validatePlugin = (plugin: $plugin) =>
  validate([
    [
      plugin.onInit && typeof plugin.onInit !== 'function',
      'Plugin onInit must be a function'
    ],
    [
      plugin.onModel && typeof plugin.onModel !== 'function',
      'Plugin onModel must be a function',
    ],
    [
      plugin.middleware && typeof plugin.middleware !== 'function',
      'Plugin middleware must be a function',
    ],
  ])

export const addPluginMiddleware = (plugins: $pluginCreator[], exposed) => {
  plugins.forEach(({ init }) => {
    const plugin: $plugin = init(exposed)
    if (plugin.middleware) {
      pluginMiddlewares.push(plugin.middleware)
    }
  })
}

export const createPlugins = (plugins: $pluginCreator[], exposed) => {
  plugins.forEach(({ init }) => {
    const plugin: $plugin = init(exposed)
    validatePlugin(plugin)
    if (plugin.onInit) {
      plugin.onInit(getStore)
    }
    if (plugin.onModel) {
      modelHooks.push(plugin.onModel)
    }
    if (plugin.model) {
      createModel(plugin.model)
    }
  })
}

export const setupPlugins = (config) => {
  // merge config with any plugin configs
  const mergedConfig = (config.plugins || []).reduce((a, b) => {
    if (b.config) {
      return mergeConfig(a, b.config)
    }
    return a
  }, config)

  const plugins = corePlugins.concat(mergedConfig.plugins || [])
  const exposed = {
    validate,
  }

  plugins.forEach((plugin) => {
    // create plugin shared data space called "exposed"
    Object.keys(plugin.expose || {}).forEach(key => {
      exposed[key] = plugin.expose[key]
    })
  })

  // plugin middleware must be added before creating store
  addPluginMiddleware(plugins, exposed)
  // create a redux store with initialState
  // merge in additional extra reducers
  createStore(mergedConfig)

  // setup plugin pipeline
  createPlugins(plugins, exposed)
}

