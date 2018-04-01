import { Dispatch, Middleware, Store } from 'redux'
import { Config, ConfigRedux, Exposed, Model, ModelHook, PluginCreator } from '../typings/rematch'
import dispatchPlugin from './plugins/dispatch'
import effectsPlugin from './plugins/effects'
import PluginFactory from './plugins/pluginFactory'
import Redux from './redux'
import * as Reducers from './redux/reducers'
import buildPlugins from './utils/buildPlugins'
import getExposed from './utils/getExposed'
import getModels from './utils/getModels'
import isObject from './utils/isObject'
import mergeConfig from './utils/mergeConfig'
import validate from './utils/validate'

const corePlugins = [dispatchPlugin, effectsPlugin]

export default class Rematch<S> {
  private config: Config
  private models: Model[]
  private redux: any
  private plugins = []
  private pluginFactory

  constructor(config: Config) {
    this.config = mergeConfig(config)
    this.pluginFactory = new PluginFactory()
    corePlugins
      // .concat(this.config.plugins)
      .forEach((plugin) => this.plugins.push(this.pluginFactory.create(plugin)))
    // preStore: middleware, model hooks
    this.forEachPlugin('middleware', (middleware) => {
      this.config.redux.middlewares.push(middleware)
    })
  }
  public forEachPlugin(method, fn) {
    this.plugins.forEach((plugin: Plugin) => {
      if (plugin[method]) {
        fn(plugin[method])
      }
    })
  }
  public addModel(model: Model) {
    validate([
      [!model, 'model config is required'],
      [
        !model.name || typeof model.name !== 'string',
        'model "name" [string] is required',
      ],
      [model.state === undefined, 'model "state" is required'],
    ])
    // run plugin model subscriptions
    this.forEachPlugin('onModel', (onModel) => onModel(model))
  }
  public init() {
    // collect all models
    this.models = getModels(this.config.models)
    this.models.forEach((model: Model) => this.addModel(model))
    // create a redux store with initialState
    // merge in additional extra reducers
    this.redux = new Redux(this)
    this.forEachPlugin('onStoreCreated', (onStoreCreated) => onStoreCreated(this.redux.store))
    this.redux.store.dispatch = this.pluginFactory.dispatch
    return this.redux.store
  }
}
