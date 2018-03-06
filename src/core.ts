import { Middleware, Store } from 'redux'
import { MiddlewareDefinition, ModelHook, Plugin } from '../typings/rematch'
import ModelFactory from './model'
import LocalStore from './redux/store'

export default class CoreFactory<S> {

  private readonly model: ModelFactory<S>
  private readonly localStore: LocalStore<S>

  constructor(model: ModelFactory<S>, localStore: LocalStore<S>) {
    this.model = model
    this.localStore = localStore

    this.preStore.bind(this)
    this.postStore.bind(this)
  }

  public preStore(plugins: Array<Plugin<S>>) {
    plugins.forEach((plugin: Plugin<S>) => {
      if (plugin.middleware) {
        this.localStore.pluginMiddlewares.push(plugin.middleware)
      }

      if (plugin.onModel) {
        this.model.modelHooks.push(plugin.onModel)
      }
    })
  }

  public postStore(plugins: Array<Plugin<S>>, store: Store<S>) {
    plugins.forEach((plugin: Plugin<S>) => {
      if (plugin.onStoreCreated) {
        plugin.onStoreCreated(store)
      }
    })
  }

}
