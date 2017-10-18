import corePlugins from './plugins'

export const onModelHooks = []
export const pluginMiddlewares = []

const createPlugin = plugin => plugin()

const createPlugins = (plugins: $plugin[] = []) =>
  corePlugins
    .concat(plugins)
    .map(createPlugin)
    .forEach((plugin: $plugin) => {
      if (plugin.onModel) {
        onModelHooks.push(plugin.onModel)
      }
      if (plugin.middleware) {
        pluginMiddlewares.push(plugin.middleware)
      }
    })

export default createPlugins
