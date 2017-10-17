// @flow
import validate from './utils/validate'
import { createReducersAndUpdateStore, getStore } from './store'
import { onModelHooks, pluginExports } from './plugins'

const validateModel = (model: $model) =>
  validate([
    [!model, 'model config is required'],
    [
      !model.name || typeof model.name !== 'string',
      'model "name" [string] is required',
    ],
    [model.state === undefined, 'model "state" is required'],
  ])

/**
 * model
 */
export default (model: $model): void => {
  validateModel(model)

  createReducersAndUpdateStore(model)

  const { dispatch } = getStore()

  onModelHooks.forEach(modelHook => {
    modelHook(model, pluginExports, dispatch)
  })
}
