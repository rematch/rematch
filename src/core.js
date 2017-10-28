// @flow
import validate from './utils/validate'
import { getStore } from './utils/store'
import createModel from './model'

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

const buildPlugin = (createPlugin): $plugin => {
  const { dispatch } = getStore()
  return createPlugin(dispatch)
}

export const createPlugins = (plugins) => {
  plugins.forEach(createPlugin => {
    const plugin = buildPlugin(createPlugin)
    validatePlugin(plugin)
    if (plugin.onModel) {
      modelHooks.push(plugin.onModel)
    }
    if (plugin.middleware) {
      pluginMiddlewares.push(plugin.middleware)
    }
    if (plugin.onInit) {
      plugin.onInit()
    }
    if (plugin.model) {
      createModel(plugin.model)
    }
  })
}
