// @flow
import validate from './utils/validate'
import { getStore } from './utils/store'
import createModel from './model'

export const modelHooks = []
export const pluginMiddlewares = []
const exposed = {}

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

export const populateExpose = (plugins) => {
  plugins.forEach(p => {
    if (p.expose) {
      Object.keys(p.expose).forEach(key => {
        exposed[key] = p.expose[key]
      })
    }
  })
}

export const addPluginMiddleware = (plugins) => {
  plugins.forEach(createPlugin => {
    const plugin = createPlugin.internalInit(exposed)
    if (plugin.middleware) {
      pluginMiddlewares.push(plugin.middleware)
    }
  })
}

export const createPlugins = (plugins) => {
  plugins.forEach(createPlugin => {
    const plugin = createPlugin.internalInit(exposed)
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
