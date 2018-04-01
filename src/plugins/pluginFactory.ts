import { Dispatch } from 'redux'
import { Action, Plugin } from '../../typings/rematch'
import validate from '../utils/validate'

export default class PluginFactory {
  public validate = validate
  public create(plugin) {
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

    const result: Plugin = {}
    if (plugin.exposed) {
      Object.keys(plugin.exposed || {}).forEach((key) => {
        this[key] = typeof plugin.exposed[key] === 'function'
          ? plugin.exposed[key].bind(this)
          : plugin.exposed[key]
      })
    }
    if (plugin.onModel) {
      result.onModel = plugin.onModel.bind(this)
    }
    if (plugin.middleware) {
      result.middleware = plugin.middleware.bind(this)
    }
    if (plugin.onStoreCreated) {
      result.onStoreCreated = plugin.onStoreCreated.bind(this)
    }
    return result
  }
}
