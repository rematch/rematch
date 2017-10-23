// @flow
import validate from './utils/validate'
import { getStore } from './utils/store'
import createModel from './model'

export const modelHooks = []
export const pluginMiddlewares = []

const validatePlugin = (plugin: $plugin) =>
  validate([
    [
      plugin.onModel && typeof plugin.onModel !== 'function',
      'Plugin onModel must be a function',
    ],
    [
      plugin.middleware && typeof plugin.middleware !== 'function',
      'Plugin middleware must be a function',
    ],
  ])

export const createPlugins = (plugins: $plugin[]) => {
  plugins.forEach((plugin: $plugin) => {
    validatePlugin(plugin)
    if (plugin.onModel) {
      modelHooks.push(plugin.onModel)
    }
    if (plugin.middleware) {
      pluginMiddlewares.push(plugin.middleware)
    }
  })
}

export const initPlugins = (plugins: $plugin[]) => {
  plugins.forEach((plugin: $plugin) => {
    if (plugin.onInit) {
      const { dispatch } = getStore()
      plugin.onInit(dispatch)
    }
    if (plugin.model) {
      createModel(plugin.model)
    }
  })
}
