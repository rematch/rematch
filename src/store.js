// @flow
/* eslint no-underscore-dangle: 0 */
import { createStore, applyMiddleware, combineReducers, compose } from 'redux'

// enable redux devtools
const composeEnhancers =
 process.env.NODE_ENV !== 'production' && global.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
   ? global.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
   : compose

// create store
export default (initialState: any = {}, middleware: any[] = [], extraReducers: $reducers = {}) => {
  const middlewares = applyMiddleware(...middleware)
  const rootReducer = combineReducers(extraReducers)
  const enhancer = composeEnhancers(middlewares)
  return createStore(rootReducer, initialState, enhancer)
}
