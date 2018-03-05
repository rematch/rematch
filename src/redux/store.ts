/* eslint no-underscore-dangle: 0 */
import { applyMiddleware, combineReducers, createStore as _createStore, Middleware, Reducer, StoreCreator } from 'redux'
import { Config, Model, RematchStore } from '../../typings/rematch'
import { pluginMiddlewares } from '../core'
import { addModel } from '../model'
import { composeEnhancers } from './devtools'
import { createModelReducer, createRootReducer, initReducers, mergeReducers } from './reducers'

export const initStore = <S>(models, { redux }: Config): RematchStore<S> => {
  // possible overwrite of redux imports
  const createStore: StoreCreator = redux.createStore || _createStore

  // initial state
  const initialState: any = typeof redux.initialState === 'undefined' ? {} : redux.initialState

  // reducers
  initReducers(models, redux)
  const rootReducers = redux.rootReducers
  const rootReducer: Reducer<any> = createRootReducer(rootReducers)

  // middleware/enhancers
  const middlewareList: Middleware[] = [...pluginMiddlewares, ...(redux.middlewares || [])]
  const middlewares = applyMiddleware(...middlewareList)
  const enhancers = composeEnhancers(redux.devtoolOptions)(...redux.enhancers || [], middlewares)
  const store: RematchStore<S> = createStore(rootReducer, initialState, enhancers)
  store.model = (model: Model): void => {
    addModel(model)
    mergeReducers(createModelReducer(model))
    store.replaceReducer(createRootReducer(rootReducers))
  }
  return store
}
