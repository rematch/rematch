/* eslint no-underscore-dangle: 0 */
import { applyMiddleware, createStore as _createStore, Middleware, Reducer, Store, StoreCreator } from 'redux'
import { pluginMiddlewares } from '../core'
import { Config, Model } from '../typings/rematch'
import { composeEnhancers } from './devtools'
import { createModelReducer, createRootReducer, mergeReducers } from './reducers'

let store: Store<any>
let rootReducers

export const initStore = ({ redux }: Config): Store<any> => {
  const initialState: any = typeof redux.initialState === 'undefined' ? {} : redux.initialState
  const createStore: StoreCreator = redux.createStore || _createStore
  rootReducers = redux.rootReducers
  const rootReducer: Reducer<any> = createRootReducer(rootReducers)
  const middlewareList: Middleware[] = [...pluginMiddlewares, ...(redux.middlewares || [])]
  const middlewares = applyMiddleware(...middlewareList)
  const enhancers = [redux.devtoolOptions, ...(redux.enhancers || [])]
  const composedEnhancers = composeEnhancers(...enhancers)(middlewares)
  store = createStore(rootReducer, initialState, composedEnhancers)
  return store
}

export const createReducersAndUpdateStore = (model: Model): void => {
  mergeReducers(createModelReducer(model))
  store.replaceReducer(createRootReducer(rootReducers))
}
