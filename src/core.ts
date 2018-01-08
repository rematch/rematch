import { Middleware } from 'redux'
import { ModelHook, Plugin } from '../typings/rematch'

export const modelHooks: ModelHook[] = []
export const pluginMiddlewares: Middleware[] = []

export const preStore = (plugins: Plugin[]) => {
  plugins.forEach((plugin: Plugin) => {
    if (plugin.middleware) {
      pluginMiddlewares.push(plugin.middleware)
    }
    if (plugin.onModel) {
      modelHooks.push(plugin.onModel)
    }
  })
}

export const postStore = (plugins: Plugin[], store) => {
  plugins.forEach((plugin: Plugin) => {
    if (plugin.onStoreCreated) {
      plugin.onStoreCreated(store)
    }
  })
}
