import * as Redux from 'redux'
import * as R from '../typings/rematch'
import isListener from './utils/isListener'

const composeEnhancersWithDevtools = (devtoolOptions = {}): any => (
  /* istanbul ignore next */
  (typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__)
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__(devtoolOptions)
    : Redux.compose
)

export default ({ redux, models }: { redux: R.ConfigRedux, models: R.Model[] }): Redux.Store => {
  const combineReducers = redux.combineReducers || Redux.combineReducers
  const createStore: Redux.StoreCreator = redux.createStore || Redux.createStore
  const initialState: any = typeof redux.initialState !== 'undefined' ? redux.initialState : {}

  let reducers = redux.reducers

  // combine models to generate reducers
  const mergeReducers = (nextReducers: R.Reducers = {}) => {
    // set reducers
    reducers = { ...reducers, ...nextReducers }
    if (!Object.keys(reducers).length) {
      return (state: any) => state
    }
    return combineReducers(reducers)
  }

  // initialize model reducers
  for (const model of models) {
    const modelReducers = {}
    for (const modelReducer of Object.keys(model.reducers || {})) {
      const action = isListener(modelReducer) ? modelReducer : `${model.name}/${modelReducer}`
      modelReducers[action] = model.reducers[modelReducer]
    }
    reducers[model.name] = (state: any = model.state, action: R.Action) => {
      // handle effects
      if (typeof modelReducers[action.type] === 'function') {
        return modelReducers[action.type](state, action.payload, action.meta)
      }
      return state
    }
  }

  const createRootReducer = (rootReducers: R.RootReducers = {}): Redux.Reducer<any> => {
    const mergedReducers: Redux.Reducer<any> = mergeReducers()
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

  const rootReducer = createRootReducer(redux.rootReducers)

  const middlewares = Redux.applyMiddleware(...redux.middlewares)
  const enhancers = composeEnhancersWithDevtools(redux.devtoolOptions)(...redux.enhancers, middlewares)

  return createStore(rootReducer, initialState, enhancers)
}
