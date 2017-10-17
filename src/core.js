import corePlugins from './plugins'

export const pluginExports = {}
export const onModelHooks = []
export const pluginMiddlewares = []

const createPlugin = plugin => plugin(pluginExports)

const createPlugins = (plugins: $plugin[] = []) => {
  const allPlugins = corePlugins.concat(plugins)
  allPlugins.map(createPlugin).forEach((plugin: $plugin) => {
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
