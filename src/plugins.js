// @flow

export const pluginExports = {}
export const onModelHooks = []
export const pluginMiddlewares = []

export const initPlugins = plugins => {
  plugins.forEach(plugin => {
    if (plugin.onInit) {
      const x = plugin.onInit()
      x.forEach(item => {
        pluginExports[item.name] = item.val
      })
      // const { name, val } = plugin.onInit()
      // pluginExports[name] = val
    }
    if (plugin.onModel) {
      onModelHooks.push(plugin.onModel)
    }
    if (plugin.middleware) {
      pluginMiddlewares.push(plugin.middleware)
    }
  })
}
