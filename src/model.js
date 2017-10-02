// @flow
import validate from './validate'
import { mergeReducer, createReducers } from './reducers'

/**
 * model
 */
export default (model: $model): void => {
  // validate model options
  validate([
    [!model, 'model config is required'],
    [!model.name || typeof model.name !== 'string', 'model "name" [string] is required'],
    [!model.state, 'model "state" is required'],
  ])

  mergeReducer({
    [model.name]: createReducers(model)
  })
}

