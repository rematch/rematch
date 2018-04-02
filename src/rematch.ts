import * as R from '../typings/rematch'
import PluginFactory from './pluginFactory'
import dispatchPlugin from './plugins/dispatch'
import effectsPlugin from './plugins/effects'
import Redux from './redux'
import validate from './utils/validate'

const corePlugins: R.Plugin[] = [dispatchPlugin, effectsPlugin]

export default class Rematch {
  private config: R.Config
  private models: R.Model[]
  private redux: any
  private plugins: R.Plugin[] = []
  private pluginFactory: R.PluginFactory = new PluginFactory()

  constructor(config: R.Config) {
    this.config = config
    for (const plugin of corePlugins.concat(this.config.plugins)) {
      this.plugins.push(this.pluginFactory.create(plugin))
    }
    // preStore: middleware, model hooks
    this.forEachPlugin('middleware', (middleware) => {
      this.config.redux.middlewares.push(middleware)
    })
  }
  public forEachPlugin(method: string, fn: (content: any) => void) {
    for (const plugin of this.plugins) {
      if (plugin[method]) {
        fn(plugin[method])
      }
    }
  }
  public getModels(models: R.Models) {
    return Object.keys(models).map((name: string) => ({
      name,
      ...models[name],
    }))
  }
  public addModel(model: R.Model) {
    validate([
      [!model, 'model config is required'],
      [typeof model.name !== 'string', 'model "name" [string] is required'],
      [model.state === undefined, 'model "state" is required'],
    ])
    // run plugin model subscriptions
    this.forEachPlugin('onModel', (onModel) => onModel(model))
  }
  public init() {
    // collect all models
    this.models = this.getModels(this.config.models)
    for (const model of this.models) {
      this.addModel(model)
    }
    // create a redux store with initialState
    // merge in additional extra reducers
    this.redux = new Redux(this)
    this.forEachPlugin('onStoreCreated', (onStoreCreated) => onStoreCreated(this.redux.store))
    this.redux.store.dispatch = this.pluginFactory.dispatch
    return this.redux.store
  }
}
