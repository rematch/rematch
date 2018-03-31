import { Dispatch } from 'redux'
import { Action, Plugin } from '../../typings/rematch'
import validate from '../utils/validate'

export default class PluginFactory {
  public validate = validate
  public create(plugin) {
    const result: Plugin = {}
    Object.keys(plugin.exposed || {}).forEach((key) => {
      this[key] = plugin.exposed[key]
    })
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
