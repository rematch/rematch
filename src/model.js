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

  createViews(model)
}
