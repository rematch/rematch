import { Exposed, Plugin, PluginCreator } from '../typings/rematch'

export default (plugins: PluginCreator[], exposed: Exposed) => plugins.reduce((all, { init }) => {
  if (init) {
    const plugin: Plugin = init(exposed)
    exposed.validate([
      [
        plugin.onStoreCreated && typeof plugin.onStoreCreated !== 'function',
        'Plugin onStoreCreated must be a function',
      ],
      [
        plugin.onModel && typeof plugin.onModel !== 'function',
        'Plugin onModel must be a function',
      ],
      [
        plugin.middleware && typeof plugin.middleware !== 'function',
        'Plugin middleware must be a function',
      ],
    ])
    all.push(plugin)
  }
  return all
}, [])
