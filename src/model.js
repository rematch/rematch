// @flow
import { validateModel } from './validate'
import { createDispatchers } from './dispatch'
import { createEffects } from './effects'
import { createHooks } from './hooks'
import { createReducersAndUpdateStore, getStore } from './store'
import { createSelectors } from './select'
import { onModelHooks, pluginExports } from './plugins'

/**
 * model
 */
export default (model: $model): void => {
  validateModel(model)

  createReducersAndUpdateStore(model)
  onModelHooks.forEach(modelHook => {
    modelHook(model, null, pluginExports, getStore().dispatch)
  })
  createDispatchers(model)
  createEffects(model)
  createHooks(model)
  createSelectors(model)
}
