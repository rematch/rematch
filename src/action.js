// @flow

/**
 * action
 */
import { _store } from './store'

export let action = {} // eslint-disable-line

// create action
const createAction = (modelName: string, actionName: string) => payload => {
  _store.dispatch({
    type: `${modelName}/${actionName}`,
    payload,
  })
}

export const createActions = (model: $model) => {
  // add action creators for each reducer
  action[model.name] = {}
  Object.keys(model.reduce || {}).forEach((actionName: string) => {
    action[model.name][actionName] = createAction(model.name, actionName)
  })
}
