// @flow
import { validateModel } from './validate'
import { mergeReducers, createReducers } from './reducers'
import { createActions } from './action'
import { createSelectors } from './select'
import { updateStore, _store } from './store'

/**
 * model
 */
export default (model: $model): void => {
  // validate model options
  validateModel(model)

  if (!_store) throw new Error('rematch.init must be called before creating a model')

  updateStore(
    mergeReducers({
      [model.name]: createReducers(model),
    })
  )

  // add actions
  createActions(model)

  // add selectors
  createSelectors(model)
}
