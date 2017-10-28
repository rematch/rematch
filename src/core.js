// @flow
import validate from './utils/validate'
import { getStore } from './utils/store'
import createModel from './model'

export const modelHooks = []
export const pluginMiddlewares = []

const validatePluginCreator = (createPlugin) => validate([
  [
    typeof createPlugin !== 'function',
    'Plugin creator must be a function',
  ]
])

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

const buildPlugin = (createPlugin): $plugin => {
  const { dispatch } = getStore()
  return createPlugin(dispatch)
}

export const addPluginMiddleware = (plugins) => {
  plugins.forEach(createPlugin => {
    const plugin = createPlugin()
    if (plugin.middleware) {
      pluginMiddlewares.push(plugin.middleware)
    }
  })
}

export const createPlugins = (plugins) => {
  plugins.forEach(createPlugin => {
    validatePluginCreator(createPlugin)
    const plugin = buildPlugin(createPlugin)
    validatePlugin(plugin)
    if (plugin.onModel) {
      modelHooks.push(plugin.onModel)
    }
    if (plugin.model) {
      createModel(plugin.model)
    }
    if (plugin.onInit) {
      plugin.onInit()
    }
  })
}
