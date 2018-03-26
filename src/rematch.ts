import { Dispatch, Middleware, Store } from 'redux'
import { Config, ConfigRedux, Exposed, Model, ModelHook, Plugin } from '../typings/rematch'
import corePlugins from './plugins'
import Redux from './redux'
import * as Reducers from './redux/reducers'
import buildPlugins from './utils/buildPlugins'
import getExposed from './utils/getExposed'
import getModels from './utils/getModels'
import isObject from './utils/isObject'
import mergeConfig from './utils/mergeConfig'
import validate from './utils/validate'

export default class Rematch<S> {
  private config: Config
  private models: Model[]
  private modelHooks: ModelHook[] = []
  private pluginMiddlewares: Middleware[] = []
  private redux: any

  constructor(config: Config) {
    this.config = mergeConfig(config)
  }
  public preStore(plugins: Plugin[]) {
    plugins.forEach((plugin: Plugin) => {
      if (plugin.middleware) {
        this.pluginMiddlewares.push(plugin.middleware)
      }
      if (plugin.onModel) {
        this.modelHooks.push(plugin.onModel)
      }
    })
  }
  public postStore(plugins: Plugin[]) {
    plugins.forEach((plugin: Plugin) => {
      if (plugin.onStoreCreated) {
        plugin.onStoreCreated(this.redux.store)
      }
    })
  }
  public addModel(model: Model) {
    if (process.env.NODE_ENV !== 'production') {
      validate([
        [!model, 'model config is required'],
        [
          !model.name || typeof model.name !== 'string',
          'model "name" [string] is required',
        ],
        [model.state === undefined, 'model "state" is required'],
      ])
    }
    // run plugin model subscriptions
    this.modelHooks.forEach((modelHook) => modelHook(model))
  }
  public modifyStore() {
    // use plugin dispatch as store.dispatch
    this.redux.store.dispatch = corePlugins[0].expose.dispatch
    this.redux.store.model = (model: Model): void => {
      this.addModel(model)
      this.redux.mergeReducers(Reducers.createModelReducer(model))
      this.redux.store.replaceReducer(Reducers.createRootReducer(this.redux.mergeReducers)(this.redux.rootReducers))
    }
  }
  public init() {
    const pluginConfigs = corePlugins.concat(this.config.plugins || [])
    const exposed: Exposed = getExposed(pluginConfigs)
    const plugins = buildPlugins(pluginConfigs, exposed)

    // preStore: middleware, model hooks
    this.preStore(plugins)

    // collect all models
    this.models = getModels(this.config.models)
    this.models.forEach((model: Model) => this.addModel(model))

    // create a redux store with initialState
    // merge in additional extra reducers
    this.redux = new Redux(this)
    this.postStore(plugins)
    this.modifyStore()
    return this.redux.store
  }
}
