import corePlugins from './plugins'
import validate from './utils/validate'

export const onModelHooks = []
export const pluginMiddlewares = []

const validatePlugin = (plugin: $plugin) =>
  validate([
    [plugin.onModel && typeof plugin.onModel !== 'function', 'Plugin onModel must be a function'],
    [plugin.middleware && typeof plugin.middleware !== 'function', 'Plugin middleware must be a function'],
  ])

const createPlugins = (plugins: $plugin[] = []) =>
  corePlugins.concat(plugins).forEach((plugin: $plugin) => {
    validatePlugin(plugin)
    if (plugin.onModel) {
      onModelHooks.push(plugin.onModel)
    }
    if (plugin.middleware) {
      pluginMiddlewares.push(plugin.middleware)
    }
  })

export default createPlugins
