// @flow
import validate from './utils/validate'
import { createReducersAndUpdateStore, getStore } from './utils/store'
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
  const { dispatch } = getStore()
  modelHooks.forEach(modelHook => modelHook(model, dispatch))
}

export default createModel
