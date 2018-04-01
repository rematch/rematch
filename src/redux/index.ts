import {
  applyMiddleware,
  combineReducers as _combineReducers,
  createStore as _createStore,
  Reducer,
  StoreCreator,
} from 'redux'
import { Model, RematchStore } from '../../typings/rematch'
import { composeEnhancers } from './devtools'
import { createMergeReducers, createModelReducer, createRootReducer, initReducers } from './reducers'

export default class Redux<S> {
  private store: RematchStore
  private mergeReducers: Reducer<any>
  private rootReducer: Reducer<S>
  constructor(rematch) {
    const { config: { redux }, models } = rematch
    // possible overwrite of redux imports
    const createStore: StoreCreator = redux.createStore || _createStore
    const combineReducers = redux.combineReducers || _combineReducers

    // initial state
    const initialState: any = typeof redux.initialState === 'undefined' ? {} : redux.initialState

    // reducers
    const reducers = {}
    this.mergeReducers = createMergeReducers(combineReducers, reducers)
    initReducers(this.mergeReducers)(models, redux)
    this.rootReducer = createRootReducer(this.mergeReducers)(redux.rootReducers)

    // middleware/enhancers
    const middlewares = applyMiddleware(...redux.middlewares)
    const enhancers = composeEnhancers(redux.devtoolOptions)(...redux.enhancers, middlewares)

    // store
    this.store = createStore(this.rootReducer, initialState, enhancers)

    // dynamic loading of models with `replaceReducer`
    this.store.model = (model: Model): void => {
      rematch.addModel(model)
      this.mergeReducers(createModelReducer(model))
      this.store.replaceReducer(createRootReducer(this.mergeReducers)(redux.rootReducers))
    }
  }
}
