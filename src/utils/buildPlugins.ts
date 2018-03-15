import { Exposed, Plugin, PluginCreator } from '../../typings/rematch'
import getExposed from './getExposed'

export default <S>(pluginConfigs: Array<PluginCreator<S>>) => pluginConfigs.reduce((all, { init }) => {
  const exposed: Exposed<S> = getExposed(pluginConfigs)
  if (init) {
    const plugin: Plugin<S> = init(exposed)
    if (process.env.NODE_ENV !== 'production') {
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
    }
    all.push(plugin)
  }
  return all
}, [])
