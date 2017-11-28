import { modelHooks } from './core'
import { createReducersAndUpdateStore } from './redux/store'
import { Model } from './typings/rematch'
import validate from './utils/validate'

const addModel = (model: Model) => {
  validate([
    [!model, 'model config is required'],
    [
      !model.name || typeof model.name !== 'string',
      'model "name" [string] is required',
    ],
    [model.state === undefined, 'model "state" is required'],
  ])
  // run plugin model subscriptions
  modelHooks.forEach((modelHook) => modelHook(model))
}

// main model import method
// adds config.models
export const initModelHooks = (models: Model[]) => {
  models.forEach((model: Model) => addModel(model))
}

// allows merging of models dynamically
// model(model)
export const createModel = (model: Model): void => {
  addModel(model)
  // add model reducers to redux store
  createReducersAndUpdateStore(model)
}
