import corePlugins from './plugins'

export const pluginExports = {}
export const onModelHooks = []
export const pluginMiddlewares = []

export default (plugins: $plugin[] = []) => {
  corePlugins.concat(plugins).forEach((plugin: $plugin) => {
    console.log(plugin.onInit)
    if (plugin.onInit) {
      plugin.onInit().forEach(item => {
        pluginExports[item.name] = item.val
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
