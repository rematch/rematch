// @flow
import validate from './validate'

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
}
