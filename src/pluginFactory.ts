import { Plugin } from '../typings/rematch'
import validate from './utils/validate'

export default class PluginFactory {
  public validate = validate
  public create(plugin: Plugin): Plugin {
    validate([
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

    if (plugin.onInit) {
      plugin.onInit.call(this)
    }

    const result: Plugin | any = {}

    if (plugin.exposed) {
      for (const key of Object.keys(plugin.exposed)) {
        this[key] = typeof plugin.exposed[key] === 'function'
          // bind functions to plugin class
          ? plugin.exposed[key].bind(this)
          // add exposed to plugin class
          : plugin.exposed[key]
      }
    }
    for (const method of ['onModel', 'middleware', 'onStoreCreated']) {
      if (plugin[method]) {
        result[method] = plugin[method].bind(this)
      }
    }
    return result
  }
}
