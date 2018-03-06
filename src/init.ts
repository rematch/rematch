import { Store } from 'redux'
import { Config, ConfigRedux, Exposed } from '../typings/rematch'
import CoreFactory from './core'
import ModelFactory from './model'
import CorePlugins from './plugins'
import ReducersFactory from './redux/reducers'
import LocalStore from './redux/store'
import buildPlugins from './utils/buildPlugins'
import getExposed from './utils/getExposed'
import getModels from './utils/getModels'
import isObject from './utils/isObject'
import mergeConfig from './utils/mergeConfig'
import validate from './utils/validate'

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

    this.init = this.init.bind(this)
  }

  public init = (config: Config<S> | undefined = {}): Store<S> => {
    config.redux = config.redux || {}
    if (process.env.NODE_ENV !== 'production') {
      validate([
        [
          config.plugins && !Array.isArray(config.plugins),
          'init config.plugins must be an array',
        ],
        [
          config.models && isObject(config.models),
          'init config.models must be an object',
        ],
        [
          config.redux.reducers
          && isObject(config.redux.reducers),
          'init config.redux.reducers must be an object',
        ],
        [
          config.redux.middlewares && !Array.isArray(config.redux.middlewares),
          'init config.redux.middlewares must be an array',
        ],
        [
          config.redux.enhancers
          && !Array.isArray(config.redux.enhancers),
          'init config.redux.enhancers must be an array of functions',
        ],
        [
          config.redux.combineReducers && typeof config.redux.combineReducers !== 'function',
          'init config.redux.combineReducers must be a function',
        ],
        [
          config.redux.createStore && typeof config.redux.createStore !== 'function',
          'init config.redux.createStore must be a function',
        ],
      ])
    }
    config.models = config.models || {}
    const mergedConfig = mergeConfig(config)
    const pluginConfigs = this.corePlugins.corePlugins.concat(mergedConfig.plugins || [])
    const exposed: Exposed<S> = getExposed(pluginConfigs)
    const plugins = buildPlugins(pluginConfigs, exposed)

    // preStore: middleware, model hooks
    this.core.preStore(plugins)

    // collect all models
    const models = getModels(mergedConfig.models)
    this.model.initModelHooks(models)
    this.reducersFactory.initReducers(models, mergedConfig.redux)

    // create a redux store with initialState
    // merge in additional extra reducers
    const store: Store<S> = this.localStore.initStore(mergedConfig)
    this.core.postStore(plugins, store)

    // use plugin dispatch as store.dispatch
    store.dispatch = this.corePlugins.corePlugins[0].expose.dispatch

    return store
  }

}
