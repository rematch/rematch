// @flow

export const pluginExports = {}
export const onModelHooks = []
export const pluginMiddlewares = []

export const initPlugins = plugins => {
  plugins.forEach(plugin => {
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
