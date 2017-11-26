import { Middleware } from 'redux'
import { getStore } from './redux/store'
import { ModelHook, Plugin } from './typings'

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

export const postStore = (plugins: Plugin[]) => {
  plugins.forEach((plugin: Plugin) => {
    if (plugin.onStoreCreated) {
      plugin.onStoreCreated(getStore)
    }
  })
}
