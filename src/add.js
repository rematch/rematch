import action from './action'
import store from './store'

const createAction = (modelName, actionName) => payload => {
  store.dispatch({
    type: `${modelName}/${actionName}`,
    payload,
  })
}

export const createActions = (model: $model) => {
  action[model.name] = {}
  Object.keys(model.reduce).forEach(actionName => {
    // create action
    action[model.name][actionName] = createAction(model.name, actionName)
  })
}
