// @flow

/**
 * dispatch
 */
import { getStore } from './store'

let callDispatch

// dispatch as a function cannot be mutated when exported
// instead, `dispatch` calls `callDispatch` which can be mutated
export const dispatch = (action: $action) => callDispatch(action)

export const createDispatcher = (modelName: string, reducerName: string) => (payload: any) => {
  const action = {
    type: `${modelName}/${reducerName}`,
    ...(payload ? { payload } : {})
  }
  dispatch(action)
}

export const createDispatchers = (model: $model) => {
  const { name: modelName, reducers } = model

  dispatch[modelName] = {}
  Object.keys(reducers || {}).forEach((reducerName: string) => {
    dispatch[modelName][reducerName] = createDispatcher(modelName, reducerName)
  })
}

export const createDispatch = () => {
  // create dispatch binds `callDispatch` to `store.dispatch` on init
  callDispatch = getStore().dispatch
}
