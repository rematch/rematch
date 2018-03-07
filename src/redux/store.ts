/* eslint no-underscore-dangle: 0 */
import { applyMiddleware, createStore as _createStore, Middleware, Reducer, Store, StoreCreator } from 'redux'
import { Config, Model } from '../../typings/rematch'
import { pluginMiddlewares } from '../core'
import { composeEnhancers } from './devtools'
import { createModelReducer, createRootReducer, mergeReducers } from './reducers'

export let store: Store<any>
let rootReducers

export const initStore = ({ redux }: Config): Store<any> => {
  const initialState: any = typeof redux.initialState === 'undefined' ? {} : redux.initialState
  const createStore: StoreCreator = redux.createStore || _createStore
  rootReducers = redux.rootReducers
  const rootReducer: Reducer<any> = createRootReducer(rootReducers)
  const middlewareList: Middleware[] = [...pluginMiddlewares, ...(redux.middlewares || [])]
  const middlewares = applyMiddleware(...middlewareList)
  const enhancers = composeEnhancers(redux.devtoolOptions)(...redux.enhancers || [], middlewares)
  store = createStore(rootReducer, initialState, enhancers)
  return store
}

// allows for "model" to dynamically update the reducers/store
export const createReducersAndUpdateStore = (model: Model): void => {
  mergeReducers(createModelReducer(model))
  store.replaceReducer(createRootReducer(rootReducers))
}
