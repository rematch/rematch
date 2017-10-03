// @flow
/* eslint no-underscore-dangle: 0 */
import { createStore as _createStore, applyMiddleware, compose } from 'redux'
import { mergeReducers, initReducers } from './reducers'

// enable redux devtools
const composeEnhancers =
 process.env.NODE_ENV !== 'production' && global.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
   ? global.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
   : compose

export let _store // eslint-disable-line

// create store
export const createStore = (
  initialState: any = {},
  middleware: $middleware[] = [],
  extraReducers: $reducers = {},
): void => {
  initReducers()
  const middlewares = applyMiddleware(...middleware)
  const hasExtraReducers = Object.keys(extraReducers).length > 0
  const rootReducer = hasExtraReducers ? mergeReducers(extraReducers) : state => state
  const enhancer = composeEnhancers(middlewares)
  _store = _createStore(rootReducer, initialState, enhancer)
}

export const updateStore = (nextReducer: $reducer) : void => {
  _store.replaceReducer(nextReducer)
}
