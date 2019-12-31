import * as Redux from 'redux'
import * as R from '../typings'
import isListener from '../utils/isListener'

const composeEnhancersWithDevtools = (
  devtoolOptions: R.DevtoolOptions = {}
): ((...args) => Redux.StoreEnhancer) => {
  const { disabled, ...options } = devtoolOptions
  /* istanbul ignore next */
  /* eslint-disable no-underscore-dangle */
  return !disabled &&
    typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__(options)
    : Redux.compose
}

export default function(rematch: R.Rematch): R.RematchStore {
  const { redux } = rematch.config
  const combineReducers = redux.combineReducers || Redux.combineReducers
  const createStore = redux.createStore || Redux.createStore
  const initialState =
    typeof redux.initialState !== 'undefined' ? redux.initialState : {}

  // combine models to generate reducers
  const mergeReducers = <S>(): Redux.Reducer<S, R.Action> => {
    if (!Object.keys(rematch.reducers).length) {
      // no reducers, just return state
      return (state: S | any): S => state // eslint-disable-line @typescript-eslint/no-explicit-any
    }

    return combineReducers(rematch.reducers)
  }

  const createModelReducer = <T extends R.NamedModel, S extends T['state']>(
    model: T
  ): void => {
    const modelBaseReducer = model.baseReducer
    const modelReducers: R.ModelReducers<S> = {}

    for (const modelReducer of Object.keys(model.reducers || {})) {
      const action = isListener(modelReducer)
        ? modelReducer
        : `${model.name}/${modelReducer}`
      modelReducers[action] = model.reducers[modelReducer] as R.Reducer<S>
    }

    const combinedReducer = (state: S = model.state, action: R.Action): S => {
      if (typeof modelReducers[action.type] === 'function') {
        return modelReducers[action.type](state, action.payload, action.meta)
      }
      return state
    }

    let reducer: Redux.Reducer = !modelBaseReducer
      ? combinedReducer
      : (state: S, action: R.Action): S =>
          combinedReducer(modelBaseReducer(state, action), action)

    rematch.forEachPlugin('onReducer', onReducer => {
      reducer = onReducer(reducer, model.name, rematch) || reducer
    })

    rematch.reducers[model.name] = reducer
  }

  const createRootReducer = <S>(): Redux.Reducer<S, R.Action> => {
    const { rootReducers } = redux
    const mergedReducers: Redux.Reducer<S> = mergeReducers<S>()
    let rootReducer = mergedReducers

    if (rootReducers && Object.keys(rootReducers).length) {
      rootReducer = (state: S | undefined, action: R.Action): S => {
        const rootReducerAction = rootReducers[action.type]
        if (rootReducers[action.type]) {
          return mergedReducers(rootReducerAction(state, action), action)
        }
        return mergedReducers(state, action)
      }
    }

    rematch.forEachPlugin('onRootReducer', onRootReducer => {
      rootReducer = onRootReducer(rootReducer, rematch) || rootReducer
    })

    return rootReducer
  }

  // initialize model reducers
  for (const model of rematch.models) {
    createModelReducer(model)
  }

  const rootReducer = createRootReducer()

  const middlewares = Redux.applyMiddleware(...redux.middlewares)
  const enhancers = composeEnhancersWithDevtools(redux.devtoolOptions)(
    ...redux.enhancers,
    middlewares
  )

  const store = createStore(rootReducer, initialState, enhancers)

  return {
    name: rematch.config.name,
    ...store,
    // dynamic loading of models with `replaceReducer`
    model: (model: R.NamedModel) => {
      rematch.addModels([model])
      createModelReducer(model)
      store.replaceReducer(createRootReducer())
      store.dispatch({ type: '@@redux/REPLACE ' })
    },
  } as R.RematchStore
}
