import validate from './utils/validate'

export const modelSubscriptions = []
export const pluginMiddlewares = []

const validatePlugin = (plugin: $plugin) =>
  validate([
    [plugin.onModel && typeof plugin.onModel !== 'function', 'Plugin onModel must be a function'],
    [plugin.middleware && typeof plugin.middleware !== 'function', 'Plugin middleware must be a function'],
  ])

const createPlugins = (plugins: $plugin[] = [], core: $plugin[]) =>
  core.concat(plugins).forEach((plugin: $plugin) => {
    validatePlugin(plugin)
    if (plugin.onModel) {
      modelSubscriptions.push(plugin.onModel)
    }
    if (plugin.middleware) {
      pluginMiddlewares.push(plugin.middleware)
    }
  })

export default createPlugins
