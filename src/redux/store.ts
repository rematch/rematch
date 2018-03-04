/* eslint no-underscore-dangle: 0 */
import { applyMiddleware, createStore as _createStore, Middleware, Reducer, Store, StoreCreator } from 'redux'
import { Config, Model } from '../../typings/rematch'
import { pluginMiddlewares } from '../core'
import { addModel } from '../model'
import { composeEnhancers } from './devtools'
import { createModelReducer, createRootReducer, mergeReducers } from './reducers'

export const initStore = ({ redux }: Config): Store<any> => {
  const initialState: any = typeof redux.initialState === 'undefined' ? {} : redux.initialState
  const createStore: StoreCreator = redux.createStore || _createStore
  const rootReducers = redux.rootReducers
  const rootReducer: Reducer<any> = createRootReducer(rootReducers)
  const middlewareList: Middleware[] = [...pluginMiddlewares, ...(redux.middlewares || [])]
  const middlewares = applyMiddleware(...middlewareList)
  const enhancers = composeEnhancers(redux.devtoolOptions)(...redux.enhancers || [], middlewares)
  const store: Store<any> = createStore(rootReducer, initialState, enhancers)
  store.model = (model: Model): void => {
    addModel(model)
    mergeReducers(createModelReducer(model))
    store.replaceReducer(createRootReducer(rootReducers))
  }
  return store
}
