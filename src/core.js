import validate from './utils/validate'

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

const createPlugins = (plugins: $plugin[] = [], core: $plugin[]) => {
  const allPlugins = core.concat(plugins)
  allPlugins.forEach((plugin: $plugin) => {
    validatePlugin(plugin)
    if (plugin.onModel) {
      modelHooks.push(plugin.onModel)
    }
    if (plugin.middleware) {
      pluginMiddlewares.push(plugin.middleware)
    }
  })
}

export default createPlugins
