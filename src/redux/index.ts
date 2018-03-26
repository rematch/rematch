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
import { composeEnhancers } from './devtools'
import { createMergeReducers, createModelReducer, createRootReducer, initReducers } from './reducers'

export default class Redux<S> {
  private store: RematchStore<S>
  private mergeReducers
  private rootReducer: Reducer<any>
  constructor(rematch) {
    const { config: { redux }, models, addModel, pluginMiddlewares } = rematch
    // possible overwrite of redux imports
    const createStore: StoreCreator = redux.createStore || _createStore
    const combineReducers = redux.combineReducers || _combineReducers

  // initial state
    const initialState: any = typeof redux.initialState === 'undefined' ? {} : redux.initialState

  // reducers
    const reducers = {}
    this.mergeReducers = createMergeReducers(combineReducers, reducers)
    initReducers(this.mergeReducers)(models, redux)
    const rootReducers = redux.rootReducers
    this.rootReducer = createRootReducer(this.mergeReducers)(rootReducers)

  // middleware/enhancers
    const middlewareList: Middleware[] = [...pluginMiddlewares, ...(redux.middlewares || [])]
    const middlewares = applyMiddleware(...middlewareList)
    const enhancers = composeEnhancers(redux.devtoolOptions)(...redux.enhancers || [], middlewares)
    this.store = createStore(this.rootReducer, initialState, enhancers)
  }
}
