import { Dispatch } from 'redux'

import CorePluginsFactory from './plugins/index'

import CoreFactory from './core'
import InitFactory from './init'
import ModelFactory from './model'
import DispatchPluginsFactory from './plugins/dispatch'
import ReducersFactory from './redux/reducers'
import LocalStore from './redux/store'
import deprecate from './utils/deprecate'

export default class Rematch<S> {
  private corePluginsFactory = new CorePluginsFactory<S>()

  private reducersFactory = new ReducersFactory<S>()

  private localStore = new LocalStore<S>(this.reducersFactory)

  private modelFactory = new ModelFactory<S>(this.localStore)
  private coreFactory = new CoreFactory<S>(this.modelFactory, this.localStore)
  private initFactory = new InitFactory<S>(this.coreFactory, this.modelFactory, this.localStore, this.reducersFactory)

  constructor() {
    this.getState.bind(this)
    this.dispatch.bind(this)
  }

  public getState = () => {
    deprecate('getState import will be removed in @rematch/core@v1.0.0')
    return this.localStore.store.getState()
  }

  public dispatch = () => this.corePluginsFactory.dispatchPlugin.expose.dispatch
  public init = this.initFactory.init
  public model = this.modelFactory.createModel

}
