import { Model, ModelHook } from '../typings/rematch'
import CoreFactory from './core'
import LocalStore from './redux/store'
import validate from './utils/validate'

export default class ModelFactory<S> {

  public readonly modelHooks: Array<ModelHook<S>> = []
  public readonly localStore: LocalStore<S>

  constructor(localStore: LocalStore<S>) {
    this.localStore = localStore
  }

  public addModel = (model: Model<S>) => {
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

  // main model import method
  // adds config.models
  public initModelHooks = (models: Array<Model<S>>): void => {
    models.forEach((model: Model<S>) => this.addModel(model))
  }

  // allows merging of models dynamically
  // model(model)
  // public createModel = (model: Model<S>): void => {
  //   this.addModel(model)
  //   // add model reducers to redux store
  //   this.localStore.createReducersAndUpdateStore(model)
  // }

}
