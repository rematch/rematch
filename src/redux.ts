import {
  applyMiddleware,
  combineReducers as _combineReducers,
  createStore as _createStore,
  Reducer,
  StoreCreator,
  compose,
  ReducersMapObject,
} from 'redux'
import { Action, ConfigRedux, EnhancedReducers, Model, RematchStore, Reducers, RootReducers } from '../typings/rematch'
import isListener from './utils/isListener'

const composeEnhancersWithDevtools = (devtoolOptions = {}): any => (
  /* istanbul ignore next */
  (typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__)
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__(devtoolOptions)
    : compose
)

export default class Redux<S> {
  private store: RematchStore
  private mergeReducers: Reducer<any>
  private rootReducer: Reducer<S>
  private reducers: ReducersMapObject = {}

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
    Object.keys(reducers || {})
      .forEach((reducer) => {
        const action = isListener(reducer) ? reducer : `${name}/${reducer}`
        modelReducers[action] = reducers[reducer]
      })
    return {
      [name]: this.createReducer(modelReducers, state),
    }
  }

  // uses combineReducers to merge new reducers into existing reducers
  public createMergeReducers(combine, allReducers) {
    return (nextReducers: Reducers = {}) => {
      allReducers = { ...allReducers, ...nextReducers }
      if (!Object.keys(allReducers).length) {
        return (state: any) => state
      }
      return combine(allReducers)
    }
  }

  public initReducers(mergeReducers) {
    return (models: Model[], redux: ConfigRedux): void => {
      // combine existing reducers, redux.reducers & model.reducers
      mergeReducers(models.reduce((reducers, model) => ({
        ...this.createModelReducer(model),
        ...reducers,
      }), redux.reducers))
    }
  }

  public createRootReducer(mergeReducers) {
    return (rootReducers: RootReducers = {}): Reducer<any> => {
      const mergedReducers: Reducer<any> = mergeReducers()
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
  
  constructor(rematch) {
    const { config: { redux }, models } = rematch
    // possible overwrite of redux imports
    const createStore: StoreCreator = redux.createStore || _createStore
    const combineReducers = redux.combineReducers || _combineReducers

    // initial state
    const initialState: any = typeof redux.initialState === 'undefined' ? {} : redux.initialState

    // reducers
    
    this.mergeReducers = this.createMergeReducers(combineReducers, this.reducers)
    this.initReducers(this.mergeReducers)(models, redux)
    this.rootReducer = this.createRootReducer(this.mergeReducers)(redux.rootReducers)

    // middleware/enhancers
    const middlewares = applyMiddleware(...redux.middlewares)
    const enhancers = composeEnhancersWithDevtools(redux.devtoolOptions)(...redux.enhancers, middlewares)

    // store
    this.store = createStore(this.rootReducer, initialState, enhancers)

    // dynamic loading of models with `replaceReducer`
    this.store.model = (model: Model): void => {
      rematch.addModel(model)
      this.mergeReducers(this.createModelReducer(model))
      this.store.replaceReducer(this.createRootReducer(this.mergeReducers)(redux.rootReducers))
    }
  }
}
