import { Dispatch, Store } from 'redux'
import { Config, ConfigRedux, Exposed } from '../typings/rematch'
import { postStore, preStore } from './core'
import { initModelHooks } from './model'
import corePlugins from './plugins'
import { initReducers } from './redux/reducers'
import { initStore } from './redux/store'
import buildPlugins from './utils/buildPlugins'
import getExposed from './utils/getExposed'
import getModels from './utils/getModels'
import isObject from './utils/isObject'
import mergeConfig from './utils/mergeConfig'
import validate from './utils/validate'

export default class Rematch<S> {
  private config: Config<S>

  constructor(config: Config<S>) {
    this.config = mergeConfig(config)
  }

  public init = () => {
    const pluginConfigs = corePlugins.concat(this.config.plugins || [])
    const exposed: Exposed = getExposed(pluginConfigs)
    const plugins = buildPlugins(pluginConfigs, exposed)

    // preStore: middleware, model hooks
    preStore(plugins)

    // collect all models
    const models = getModels(this.config.models)
    initModelHooks(models)

    // create a redux store with initialState
    // merge in additional extra reducers
    const store: Store<any> = initStore(models, this.config)
    postStore(plugins, store)

    // use plugin dispatch as store.dispatch
    store.dispatch = corePlugins[0].expose.dispatch
    return store
  }

  // TODO: save as Store.model
  // public model = this.modelFactory.createModel
}
