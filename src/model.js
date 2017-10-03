// @flow
import { validateModel } from './validate'
import { mergeReducers, createReducers } from './reducers'
import { createActions } from './action'
import { updateStore } from './store'

/**
 * model
 */
export default (model: $model): void => {
  // validate model options
  validateModel(model)

  updateStore(
    mergeReducers({
      [model.name]: createReducers(model),
    })
  )

  // add actions
  createActions(model)
}
