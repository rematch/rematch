// @flow
import { validateModel } from './validate'
import { createDispatchers } from './dispatch'
import { createEffects } from './effects'
import { createReducersAndUpdateStore } from './store'
// import { createViews } from './select'


/**
 * model
 */
export default (model: $model): void => {
  validateModel(model)

  createReducersAndUpdateStore(model)

  createDispatchers(model)
  createEffects(model)

  // NOTE: not sure about this
  // NOTE: should only be called if a select is used
  // createViews(model)
}
