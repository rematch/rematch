// @flow
/* eslint no-underscore-dangle: 0 */
import { createStore as _createStore, applyMiddleware, compose } from 'redux'
import { mergeReducers, createModelReducer } from './reducers'
import { pluginMiddlewares } from '../core'

// enable redux devtools
/* istanbul ignore next */
const composeEnhancers =
 process.env.NODE_ENV !== 'production' && global.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
   ? global.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
   : compose

let store = null

export const getStore = () => store

// create store
export const initStore = ({ initialState, overwrites }) => {
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
  const enhancer = composeEnhancers(middlewares)

  // store
  store = createStore(rootReducer, initialState, enhancer)
}

export const createReducersAndUpdateStore = (model: $model) : void => {
  store.replaceReducer(mergeReducers(createModelReducer(model)))
}
