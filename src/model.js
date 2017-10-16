// @flow
import { validateModel } from './validate'
import { createReducersAndUpdateStore, getStore } from './store'
import { onModelHooks, pluginExports } from './plugins'

/**
 * model
 */
export default (model: $model): void => {
  validateModel(model)

  createReducersAndUpdateStore(model)
  onModelHooks.forEach(modelHook => {
    modelHook(model, pluginExports, getStore().dispatch)
  })
}
