// @flow
/* eslint no-underscore-dangle: 0 */
import { createStore as _createStore, applyMiddleware, compose } from 'redux'
import { mergeReducers } from './reducers'

// enable redux devtools
const composeEnhancers =
 process.env.NODE_ENV !== 'production' && global.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
   ? global.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
   : compose

export let store = {} // eslint-disable-line

// create store
export const createStore = (
  initialState: any = {},
  middleware: $middleware[] = [],
  extraReducers: $reducers = {},
): void => {
  const middlewares = applyMiddleware(...middleware)
  const rootReducer = mergeReducers(extraReducers)
  const enhancer = composeEnhancers(middlewares)
  store = _createStore(rootReducer, initialState, enhancer)
}
