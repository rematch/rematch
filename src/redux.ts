import {
  applyMiddleware,
  combineReducers as _combineReducers,
  compose,
  createStore as _createStore,
  Reducer,
  ReducersMapObject,
  StoreCreator,
} from 'redux'
import { Action, ConfigRedux, EnhancedReducers, Model, Reducers, RematchStore, RootReducers } from '../typings/rematch'
import isListener from './utils/isListener'

const composeEnhancersWithDevtools = (devtoolOptions = {}): any => (
  /* istanbul ignore next */
  (typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__)
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__(devtoolOptions)
    : compose
)

export default class Redux {
  private store: RematchStore
  private rootReducer: Reducer<any>
  private reducers: ReducersMapObject = {}
  private combineReducers = _combineReducers
  private createStore: StoreCreator = _createStore

  constructor(rematch) {
    const { config: { redux }, models } = rematch
    // possible overwrite of redux imports
    if (redux.createStore) {
      this.createStore = redux.createStore
    }
    if (redux.combineReducers) {
      this.combineReducers = redux.combineReducers
    }

    // initial state
    const initialState: any = typeof redux.initialState === 'undefined' ? {} : redux.initialState

    // reducers
    this.initReducers(this.mergeReducers())(models, redux)
    this.rootReducer = this.createRootReducer(this.mergeReducers)(redux.rootReducers)

    // middleware/enhancers
    const middlewares = applyMiddleware(...redux.middlewares)
    const enhancers = composeEnhancersWithDevtools(redux.devtoolOptions)(...redux.enhancers, middlewares)

    // store
    this.store = this.createStore(this.rootReducer, initialState, enhancers)

    // dynamic loading of models with `replaceReducer`
    this.store.model = (model: Model): void => {
      rematch.addModel(model)
      this.mergeReducers(this.createModelReducer(model))
      this.store.replaceReducer(this.createRootReducer(this.mergeReducers)(redux.rootReducers))
    }
  }

  public createReducer(reducer: EnhancedReducers, initialState: any) {
    return (state: any = initialState, action: Action) => {
      // handle effects
      if (typeof reducer[action.type] === 'function') {
        return reducer[action.type](state, action.payload, action.meta)
      }
      return state
    }
  }

  public createModelReducer({ name, reducers, state }: Model) {
    const modelReducers: Reducers = {}
    const allReducers = reducers || {}
    for (const reducer of Object.keys(allReducers)) {
      const action = isListener(reducer) ? reducer : `${name}/${reducer}`
      modelReducers[action] = allReducers[reducer]
    }
    return {
      [name]: this.createReducer(modelReducers, state),
    }
  }

  public initReducers() {
    return (models: Model[], redux: ConfigRedux): void => {
      // combine existing reducers, redux.reducers & model.reducers
      this.mergeReducers(models.reduce((reducers, model) => ({
        ...this.createModelReducer(model),
        ...reducers,
      }), redux.reducers))
    }
  }

  public createRootReducer() {
    return (rootReducers: RootReducers = {}): Reducer<any> => {
      const mergedReducers: Reducer<any> = this.mergeReducers()
      if (Object.keys(rootReducers).length) {
        return (state, action) => {
          const rootReducerAction = rootReducers[action.type]
          if (rootReducers[action.type]) {
            return mergedReducers(rootReducerAction(state, action), action)
          }
          return mergedReducers(state, action)
        }
      }
      return mergedReducers
    }
  }

  private mergeReducers(nextReducers: Reducers = {}) {
    this.reducers = { ...this.reducers, ...nextReducers }
    if (!Object.keys(this.reducers).length) {
      return (state: any) => state
    }
    return this.combineReducers(this.reducers)
  }
}
