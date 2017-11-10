// @flow
/* eslint no-underscore-dangle: 0 */
import { createStore as _createStore, applyMiddleware } from 'redux'
import { composeEnhancers } from './devtools'
import { mergeReducers, createModelReducer } from './reducers'
import { pluginMiddlewares } from '../core'

let store = null

export const getStore = () => store

// create store
export const initStore = ({ initialState, overwrites, devtoolOptions }) => {
  // initial state
  if (initialState === undefined) {
    initialState = {}
  }

  let createStore = _createStore
  if (overwrites && overwrites.createStore) {
    createStore = overwrites.createStore // eslint-disable-line
  }

  // reducers
  const rootReducer = mergeReducers()

  // middleware
  const middlewares = applyMiddleware(...pluginMiddlewares)

  // devtools
  const enhancer = composeEnhancers(devtoolOptions)(middlewares)

  // store
  store = createStore(rootReducer, initialState, enhancer)
}

export const createReducersAndUpdateStore = (model: $model) : void => {
  store.replaceReducer(mergeReducers(createModelReducer(model)))
}
