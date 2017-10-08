// @flow

/**
 * dispatch
 */
import { _store } from './store'

export let dispatch = {} // eslint-disable-line

const createDispatcher = (modelName: string, reducerName: string) => payload => {
  _store.dispatch({
    type: `${modelName}/${reducerName}`,
    payload,
  })
}

export const createDispatchers = (model: $model) => {
  const { name: modelName, reduce: reducers } = model

  dispatch[modelName] = {}
  Object.keys(reducers || {}).forEach((reducerName: string) => {
    dispatch[modelName][reducerName] = createDispatcher(modelName, reducerName)
  })
}
