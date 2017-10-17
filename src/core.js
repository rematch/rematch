import corePlugins from './plugins'

export const pluginExports = {}
export const onModelHooks = []
export const pluginMiddlewares = []

const createPlugins = (plugins: $plugin[] = []) => {
  corePlugins.concat(plugins).forEach((plugin: $plugin) => {
    if (plugin.onInit) {
      // merge onInit keys into pluginExports
      Object.keys(plugin.onInit).forEach(k => {
        pluginExports[k] = plugin.onInit[k]
      })
    }
    if (plugin.onModel) {
      onModelHooks.push(plugin.onModel)
    }
    if (plugin.middleware) {
      pluginMiddlewares.push(plugin.middleware)
    }
  })
}

export default createPlugins
