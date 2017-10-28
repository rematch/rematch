// @flow
import validate from './utils/validate'
import { createReducersAndUpdateStore } from './utils/store'
import { modelHooks } from './core'

const validateModel = (model: $model) =>
  validate([
    [!model, 'model config is required'],
    [
      !model.name || typeof model.name !== 'string',
      'model "name" [string] is required',
    ],
    [model.state === undefined, 'model "state" is required'],
  ])

const createModel = (model: $model): void => {
  validateModel(model)

  // add model reducers to redux store
  createReducersAndUpdateStore(model)

  // run plugin model subscriptions
  modelHooks.forEach(modelHook => modelHook(model))
}

export default createModel
