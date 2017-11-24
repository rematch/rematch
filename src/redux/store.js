// @flow
/* eslint no-underscore-dangle: 0 */
import { createStore as _createStore, applyMiddleware } from 'redux'
import { composeEnhancers } from './devtools'
import { mergeReducers, createModelReducer } from './reducers'
import { pluginMiddlewares } from '../core'

let store = null

// access file scoped store
export const getStore = () => store

export const initStore = ({ redux }) => {
  const initialState = typeof redux.initialState === 'undefined' ? {} : redux.initialState
  const createStore = redux.createStore || _createStore
  const rootReducer = mergeReducers()
  const middlewareList = [...pluginMiddlewares, ...(redux.middlewares || [])]
  const middlewares = applyMiddleware(...middlewareList)
  const enhancers = composeEnhancers(redux.devtoolOptions)(middlewares)
  store = createStore(rootReducer, initialState, enhancers)
}

export const createReducersAndUpdateStore = (model: $model) : void => {
  store.replaceReducer(mergeReducers(createModelReducer(model)))
}
