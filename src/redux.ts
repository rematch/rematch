import * as Redux from 'redux'
import * as R from '../typings/rematch'
import isListener from './utils/isListener'

const composeEnhancersWithDevtools = (devtoolOptions = {}): any => (
  /* istanbul ignore next */
  (typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__)
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__(devtoolOptions)
    : Redux.compose
)

/**
 * RematchRedux class
 *
 * the core Redux implementation of Rematch
 */
export default class RematchRedux {
  protected store: any
  private rootReducer: Redux.Reducer<any>
  private reducers: Redux.ReducersMapObject = {}
  private combineReducers = Redux.combineReducers
  private createStore: Redux.StoreCreator = Redux.createStore

  constructor(rematch: any) {
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
    this.initReducers(models, redux)
    this.rootReducer = this.createRootReducer(redux.rootReducers)

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
        store.replaceReducer(this.createRootReducer(redux.rootReducers))
      },
    }
  }

  public createModelReducer({ name, reducers, state: initialState }: R.Model) {
    const modelReducers = {}
    const allReducers = reducers || {}
    for (const reducer of Object.keys(allReducers)) {
      const action = isListener(reducer) ? reducer : `${name}/${reducer}`
      modelReducers[action] = allReducers[reducer]
    }
    return {
      [name]: (state: any = initialState, action: R.Action) => {
        // handle effects
        if (typeof modelReducers[action.type] === 'function') {
          return modelReducers[action.type](state, action.payload, action.meta)
        }
        return state
      },
    }
  }

  public initReducers(models: R.Model[], redux: R.ConfigRedux) {
    // combine existing reducers, redux.reducers & model.reducers
    this.mergeReducers(models.reduce((reducers, model) => ({
      ...this.createModelReducer(model),
      ...reducers,
    }), redux.reducers))
  }

  // combine all reducers to create reducer
  public createRootReducer(rootReducers: R.RootReducers = {}): Redux.Reducer<any> {
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

  private mergeReducers(nextReducers: R.Reducers = {}) {
    // set reducers
    this.reducers = { ...this.reducers, ...nextReducers }
    if (!Object.keys(this.reducers).length) {
      return (state: any) => state
    }
    return this.combineReducers(this.reducers)
  }
}
