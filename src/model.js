// @flow
import validate from './validate'
import { mergeReducers, createReducers } from './reducers'

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

  mergeReducers({
    [model.name]: createReducers(model),
  })
}
