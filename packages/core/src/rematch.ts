import * as Redux from 'redux'
import * as R from './typings'
import createModels from './creators/models'
import createPlugins from './creators/plugins'
import createRematchStore from './creators/rematchStore'
import validate, { validateModel } from './utils/validate'

export default class Rematch implements R.Rematch {
  validate = validate
  reducers: Redux.ReducersMapObject
  models: R.NamedModel[]
  private readonly plugins: R.Plugin[]

  constructor(public config: R.Config) {
    this.reducers = config.redux.reducers

    this.plugins = createPlugins(this, config.plugins)
    this.collectMiddlewaresFromPlugins()

    this.models = createModels(config.models)
    this.addModels(this.models)
  }

  public collectMiddlewaresFromPlugins(): void {
    this.forEachPlugin('createMiddleware', createMiddleware => {
      this.config.redux.middlewares.push(createMiddleware(this))
    })
  }

  public addModels(models: R.NamedModel[]): void {
    for (const model of models) {
      validateModel(model)
      this.forEachPlugin('onModel', onModel => onModel(model, this))
    }
  }

  public createStore(): R.RematchStore {
    let rematchStore = createRematchStore(this)

    this.forEachPlugin('onStoreCreated', onStoreCreated => {
      rematchStore = onStoreCreated(rematchStore, this) || rematchStore
    })

    return rematchStore
  }

  public forEachPlugin<Key extends keyof R.PluginHooks>(
    method: Key,
    fn: (content: NonNullable<R.PluginHooks[Key]>) => void
  ): void {
    for (const plugin of this.plugins) {
      if (plugin[method]) {
        fn(plugin[method] as NonNullable<R.PluginHooks[Key]>)
      }
    }
  }
}
