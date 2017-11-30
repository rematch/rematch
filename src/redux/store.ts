/* eslint no-underscore-dangle: 0 */
import { applyMiddleware, createStore as _createStore, Middleware, Reducer, Store, StoreCreator } from 'redux'
import { pluginMiddlewares } from '../core'
import { Config, Model } from '../typings/rematch'
import { composeEnhancers } from './devtools'
import { createModelReducer, mergeReducers  } from './reducers'

let store: Store<any> = null

// access file scoped store
export const getStore = () => store

export const initStore = ({ redux }: Config) => {
  const initialState: any = typeof redux.initialState === 'undefined' ? {} : redux.initialState
  const createStore: StoreCreator = redux.createStore || _createStore
  const rootReducer: Reducer<any> = mergeReducers()
  const middlewareList: Middleware[] = [...pluginMiddlewares, ...(redux.middlewares || [])]
  const middlewares = applyMiddleware(...middlewareList)
  const enhancers = composeEnhancers(redux.devtoolOptions)(middlewares)
  store = createStore(rootReducer, initialState, enhancers)
}

export const createReducersAndUpdateStore = (model: Model): void => {
  store.replaceReducer(mergeReducers(createModelReducer(model)))
}
