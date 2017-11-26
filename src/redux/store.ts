/* eslint no-underscore-dangle: 0 */
import { createStore as _createStore, applyMiddleware, Store } from 'redux'
import { composeEnhancers } from './devtools'
import { mergeReducers, createModelReducer } from './reducers'
import { pluginMiddlewares } from '../core'
import { ConfigRedux, Model } from '../typings'

let store: Store<any> = null

// access file scoped store
export const getStore = () => store

export const initStore = ({ redux }: { redux: ConfigRedux }) => {
  const initialState = typeof redux.initialState === 'undefined' ? {} : redux.initialState
  const createStore = redux.createStore || _createStore
  const rootReducer = mergeReducers()
  const middlewareList = [...pluginMiddlewares, ...(redux.middlewares || [])]
  const middlewares = applyMiddleware(...middlewareList)
  const enhancers = composeEnhancers(redux.devtoolOptions)(middlewares)
  store = createStore(rootReducer, initialState, enhancers)
}

export const createReducersAndUpdateStore = (model: Model) : void => {
  store.replaceReducer(mergeReducers(createModelReducer(model)))
}
