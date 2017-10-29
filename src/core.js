// @flow
import validate from './utils/validate'
import { getStore, createStore } from './utils/store'
import createModel from './model'
import corePlugins from './plugins'

export const modelHooks = []
export const pluginMiddlewares = []

const validatePlugin = (plugin: $plugin) => validate([
  [
    plugin.onModel && typeof plugin.onModel !== 'function',
    'Plugin onModel must be a function',
  ],
  [
    plugin.middleware && typeof plugin.middleware !== 'function',
    'Plugin middleware must be a function',
  ],
])

export const addPluginMiddleware = (plugins, exposed) => {
  plugins.forEach(createPlugin => {
    const plugin = createPlugin.init(exposed)
    if (plugin.middleware) {
      pluginMiddlewares.push(plugin.middleware)
    }
  })
}

export const createPlugins = (plugins, exposed) => {
  plugins.forEach(createPlugin => {
    const plugin = createPlugin.init(exposed)
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

const setupExpose = plugins => {
  const exposed = {}
  plugins.forEach(plugin => {
    Object.keys(plugin.expose || {}).forEach(key => {
      exposed[key] = plugin.expose[key]
    })
  })
  return exposed
}

export const setupPlugins = (config) => {
  const plugins = corePlugins.concat(config.plugins || [])

  const exposed = setupExpose(plugins)

  // plugin middleware must be added before creating store
  addPluginMiddleware(plugins, exposed)
  // create a redux store with initialState
  // merge in additional extra reducers
  createStore(config.initialState, config.extraReducers)

  // setup plugin pipeline
  createPlugins(plugins, exposed)
}

