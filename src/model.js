// @flow
import validate from './utils/validate'
import { createReducersAndUpdateStore } from './redux/store'
import { modelHooks } from './core'

const addModel = (model: $model) => {
  validate([
    [!model, 'model config is required'],
    [
      !model.name || typeof model.name !== 'string',
      'model "name" [string] is required',
    ],
    [model.state === undefined, 'model "state" is required'],
  ])
  // run plugin model subscriptions
  modelHooks.forEach(modelHook => modelHook(model))
}

export const createModel = (model: $model): void => {
  addModel(model)
  // add model reducers to redux store
  createReducersAndUpdateStore(model)
}

export const createInitModels = (models) => {
  models.forEach(model => {
    addModel(model)
  })
}
