// @flow

/**
 * dispatch
 */
import { getStore } from './store'

export let dispatch = {} // eslint-disable-line

export const createDispatcher = (modelName: string, reducerName: string) => (payload: any) => {
  const action = {
    type: `${modelName}/${reducerName}`,
    ...(payload ? { payload } : {})
  }
  getStore().dispatch(action)
}

export const createDispatchers = (model: $model) => {
  const { name: modelName, reducers } = model

  dispatch[modelName] = {}
  Object.keys(reducers || {}).forEach((reducerName: string) => {
    dispatch[modelName][reducerName] = createDispatcher(modelName, reducerName)
  })
}
