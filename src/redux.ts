import * as Redux from 'redux'
import * as R from '../typings/rematch'
import isListener from './utils/isListener'

const composeEnhancersWithDevtools = (devtoolOptions = {}): any => (
  /* istanbul ignore next */
  (typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__)
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__(devtoolOptions)
    : Redux.compose
)

interface RematchClass {
  config: R.Config,
  models: R.Models,
  addModel(model: R.Model): void,
}

export default class RematchRedux {
  protected store: R.RematchStore
  private rootReducer: Redux.Reducer<any>
  private reducers: Redux.ReducersMapObject = {}
  private combineReducers = Redux.combineReducers
  private createStore: Redux.StoreCreator = Redux.createStore

  constructor(rematch: RematchClass) {
    const { config: { redux }, models } = rematch
    // possible overwrite of redux imports
    for (const overwrite of ['createStore', 'combineReducers']) {
      if (redux[overwrite]) {
        this[overwrite] = redux[overwrite]
      }
    }

    // initial state
    const initialState: any = typeof redux.initialState !== 'undefined' ? redux.initialState : {}

    // reducers
    this.initReducers(this.mergeReducers())(models, redux)
    this.rootReducer = this.createRootReducer(this.mergeReducers)(redux.rootReducers)

    // middleware/enhancers
    const middlewares = Redux.applyMiddleware(...redux.middlewares)
    const enhancers = composeEnhancersWithDevtools(redux.devtoolOptions)(...redux.enhancers, middlewares)

    const store = this.createStore(this.rootReducer, initialState, enhancers)
    // store
    this.store = {
      ...store,
      // dynamic loading of models with `replaceReducer`
      model: (model: R.Model) => {
        rematch.addModel(model)
        this.mergeReducers(this.createModelReducer(model))
        store.replaceReducer(this.createRootReducer(this.mergeReducers)(redux.rootReducers))
      },
    }
  }

  public createReducer(reducer: R.EnhancedReducers, initialState: any) {
    return (state: any = initialState, action: R.Action) => {
      // handle effects
      if (typeof reducer[action.type] === 'function') {
        return reducer[action.type](state, action.payload, action.meta)
      }
      return state
    }
  }

  public createModelReducer({ name, reducers, state }: R.Model) {
    const modelReducers: R.Reducers = {}
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
    return (models: R.Model[], redux: R.ConfigRedux): void => {
      // combine existing reducers, redux.reducers & model.reducers
      this.mergeReducers(models.reduce((reducers, model) => ({
        ...this.createModelReducer(model),
        ...reducers,
      }), redux.reducers))
    }
  }

  public createRootReducer() {
    return (rootReducers: R.RootReducers = {}): Redux.Reducer<any> => {
      const mergedReducers: Redux.Reducer<any> = this.mergeReducers()
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

  private mergeReducers(nextReducers: R.Reducers = {}) {
    this.reducers = { ...this.reducers, ...nextReducers }
    if (!Object.keys(this.reducers).length) {
      return (state: any) => state
    }
    return this.combineReducers(this.reducers)
  }
}
