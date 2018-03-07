import { Dispatch } from 'redux'
import CoreFactory from './core'
import InitFactory from './init'
import ModelFactory from './model'
import DispatchPluginsFactory from './plugins/dispatch'
import CorePluginsFactory from './plugins/index'
import ReducersFactory from './redux/reducers'
import LocalStore from './redux/store'

export default class Rematch<S> {
  private corePluginsFactory = new CorePluginsFactory<S>()
  private reducersFactory = new ReducersFactory<S>()
  private localStore = new LocalStore<S>(this.reducersFactory)
  private modelFactory = new ModelFactory<S>(this.localStore)
  private coreFactory = new CoreFactory<S>(this.modelFactory, this.localStore)
  private initFactory = new InitFactory<S>(this.coreFactory, this.modelFactory, this.localStore, this.reducersFactory)

  constructor(config) {
    this.config = config
  }

  public dispatch = () => this.corePluginsFactory.dispatchPlugin.expose.dispatch
  public init = this.initFactory.init

  // TODO: save as Store.model
  // public model = this.modelFactory.createModel
}
