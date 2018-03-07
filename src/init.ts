import { Store } from 'redux'
import { Config, ConfigRedux, Exposed } from '../typings/rematch'
import CoreFactory from './core'
import ModelFactory from './model'
import CorePlugins from './plugins'
import ReducersFactory from './redux/reducers'
import LocalStore from './redux/store'
import buildPlugins from './utils/buildPlugins'
import getModels from './utils/getModels'
import mergeConfig from './utils/mergeConfig'

export default class InitFactory<S> {

  private core: CoreFactory<S>
  private model: ModelFactory<S>
  private localStore: LocalStore<S>
  private corePlugins: CorePlugins<S> = new CorePlugins<S>()
  private reducersFactory: ReducersFactory<S>

  constructor(
    core: CoreFactory<S>,
    model: ModelFactory<S>,
    localStore: LocalStore<S>,
    reducersFactory: ReducersFactory<S>,
  ) {
    this.core = core
    this.model = model
    this.localStore = localStore
    this.reducersFactory = reducersFactory
  }

  public init = (config: Config<S> | undefined = {}): Store<S> => {
    const pluginConfigs = this.corePlugins.corePlugins.concat(config.plugins || [])
    const plugins = buildPlugins(pluginConfigs)

    // preStore: middleware, model hooks
    this.core.preStore(plugins)

    // collect all models
    const models = getModels(config.models)
    this.model.initModelHooks(models)
    this.reducersFactory.initReducers(models, config.redux)

    // create a redux store with initialState
    // merge in additional extra reducers
    const store: Store<S> = this.localStore.initStore(config)
    this.core.postStore(plugins, store)

    // use plugin dispatch as store.dispatch
    store.dispatch = this.corePlugins.corePlugins[0].expose.dispatch

    return store
  }

}
