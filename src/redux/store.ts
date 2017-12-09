/* eslint no-underscore-dangle: 0 */
import { applyMiddleware, createStore as _createStore, Middleware, Reducer, Store, StoreCreator } from 'redux'
import { pluginMiddlewares } from '../core'
import { Config, Model } from '../typings/rematch'
import { composeEnhancers } from './devtools'
import { createModelReducer, mergeReducers  } from './reducers'

let store: Store<any>

export const initStore = ({ redux }: Config): Store<any> => {
  const initialState: any = typeof redux.initialState === 'undefined' ? {} : redux.initialState
  const createStore: StoreCreator = redux.createStore || _createStore
  let rootReducer: Reducer<any> = mergeReducers()
  if (redux.rootReducerWrapper) {
    rootReducer = redux.rootReducerWrapper(rootReducer)
  }
  const middlewareList: Middleware[] = [...pluginMiddlewares, ...(redux.middlewares || [])]
  const middlewares = applyMiddleware(...middlewareList)
  const enhancers = [redux.devtoolOptions, ...(redux.enhancers || [])]
  const composedEnhancers = composeEnhancers(...enhancers)(middlewares)
  store = createStore(rootReducer, initialState, composedEnhancers)
  return store
}

export const createReducersAndUpdateStore = (model: Model): void => {
  store.replaceReducer(mergeReducers(createModelReducer(model)))
}
