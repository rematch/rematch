// @flow
import { validateModel } from './validate'
import { createDispatchers } from './dispatch'
import { createReducersAndUpdateStore } from './store'
import { createViews } from './view'


/**
 * model
 */
export default (model: $model): void => {
  validateModel(model)

  createReducersAndUpdateStore(model)

  createDispatchers(model)

  // NOTE: not sure about this
  // NOTE: should only be called if a view is used
  createViews(model)
}
