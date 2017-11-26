import { getStore } from './redux/store'

export const modelHooks = []
export const pluginMiddlewares = []

export const preStore = (plugins: plugin[]) => {
  plugins.forEach((plugin: plugin) => {
    if (plugin.middleware) {
      pluginMiddlewares.push(plugin.middleware)
    }
    if (plugin.onModel) {
      modelHooks.push(plugin.onModel)
    }
  })
}

export const postStore = (plugins: plugin[]) => {
  plugins.forEach((plugin: plugin) => {
    if (plugin.onStoreCreated) {
      plugin.onStoreCreated(getStore)
    }
  })
}
