// @flow
/* eslint no-underscore-dangle: 0 */
import { createStore as _createStore, applyMiddleware, compose } from 'redux'
import { mergeReducers, initReducers, createReducers } from './reducers'
import { createMiddleware } from './middleware'

// enable redux devtools
const composeEnhancers =
 process.env.NODE_ENV !== 'production' && global.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
   ? global.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
   : compose

export let store = null // eslint-disable-line

export const getStore = () => store

// create store
export const createStore = (
  initialState: any = {},
  middleware: $middleware[] = [],
  extraReducers: $reducers = {},
): void => {
  initReducers()
  const rematchMiddleware = createMiddleware()
  const middlewares = applyMiddleware(...middleware, rematchMiddleware)
  const hasExtraReducers = Object.keys(extraReducers).length > 0
  const rootReducer = hasExtraReducers ? mergeReducers(extraReducers) : state => state
  const enhancer = composeEnhancers(middlewares)
  store = _createStore(rootReducer, initialState, enhancer)
}

export const createReducersAndUpdateStore = (model: $model) : void => {
  if (!store) throw new Error('rematch.init must be called before creating a model')

  store.replaceReducer(
    mergeReducers({
      [model.name]: createReducers(model),
    })
  )
}

export const subscribe = (
  select: (state: {}) => any,
  onChange: (value: any) => void,
): (() => void) => {
  let currentState

  const handleChange = () => {
    const nextState = select(store.getState())
    if (nextState !== currentState) {
      currentState = nextState
      onChange(currentState)
    }
  }

  const unsubscribe = store.subscribe(handleChange)
  handleChange()
  return unsubscribe
}
