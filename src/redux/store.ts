/* eslint no-underscore-dangle: 0 */
import {
  applyMiddleware,
  combineReducers as _combineReducers,
  createStore as _createStore,
  Middleware,
  Reducer,
  StoreCreator,
} from 'redux'
import { Config, Model, RematchStore } from '../../typings/rematch'
import { pluginMiddlewares } from '../core'
import { addModel } from '../model'
import { composeEnhancers } from './devtools'
import { createMergeReducers, createModelReducer, createRootReducer, initReducers } from './reducers'

export const initStore = <S>(models, { redux }: Config): RematchStore<S> => {
  // possible overwrite of redux imports
  const createStore: StoreCreator = redux.createStore || _createStore
  const combineReducers = redux.combineReducers || _combineReducers

  // initial state
  const initialState: any = typeof redux.initialState === 'undefined' ? {} : redux.initialState

  // reducers
  const reducers = {}
  const mergeReducers = createMergeReducers(combineReducers, reducers)
  initReducers(mergeReducers)(models, redux)
  const rootReducers = redux.rootReducers
  const rootReducer: Reducer<any> = createRootReducer(mergeReducers)(rootReducers)

  // middleware/enhancers
  const middlewareList: Middleware[] = [...pluginMiddlewares, ...(redux.middlewares || [])]
  const middlewares = applyMiddleware(...middlewareList)
  const enhancers = composeEnhancers(redux.devtoolOptions)(...redux.enhancers || [], middlewares)
  const store: RematchStore<S> = createStore(rootReducer, initialState, enhancers)
  store.model = (model: Model): void => {
    addModel(model)
    mergeReducers(createModelReducer(model))
    store.replaceReducer(createRootReducer(mergeReducers)(rootReducers))
  }
  return store
}
