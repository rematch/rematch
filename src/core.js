// @flow
import createModel from './model'
import { getStore } from './redux/store'

export const modelHooks = []
export const pluginMiddlewares = []

export const preStore = (plugins) => {
  plugins.forEach((plugin) => {
    if (plugin.middleware) {
      pluginMiddlewares.push(plugin.middleware)
    }
  })
}

export const postStore = (plugins) => {
  plugins.forEach((plugin) => {
    if (plugin.onModel) {
      modelHooks.push(plugin.onModel)
    }
    if (plugin.model) {
      createModel(plugin.model)
    }
    if (plugin.onInit) {
      plugin.onInit(getStore)
    }
  })
}
