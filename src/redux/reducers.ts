/* eslint no-underscore-dangle: 0 */
import { combineReducers } from 'redux'

let combine = combineReducers

let _reducers: $reducers = {}

// get reducer for given dispatch type
// pass in (state, payload)
export const getReducer = (reducer: $reducers, initialState: any) => (
  state: any = initialState,
  action: action,
) => {
  if (typeof reducer[action.type] === 'function') {
    return reducer[action.type](state, action.payload)
  }
  return state
}

// creates a reducer out of "reducers" keys and values
export const createModelReducer = ({ name, reducers, state }: model) => ({
  [name]: getReducer(Object.keys(reducers || {}).reduce((acc, reducer) => {
    acc[`${name}/${reducer}`] = reducers[reducer]
    return acc
  }, {}), state),
})

// uses combineReducers to merge new reducers into existing reducers
export const mergeReducers = (nextReducers: $reducers = {}) => {
  _reducers = { ..._reducers, ...nextReducers }
  if (!Object.keys(_reducers).length) {
    return state => state
  }
  return combine(_reducers)
}

export const initReducers = (models, redux) : void => {
  // optionally overwrite combineReducers on init
  combine = redux.combineReducers || combine

  // combine existing reducers, redux.reducers & model.reducers
  mergeReducers(models.reduce((reducers, model) => ({
    ...createModelReducer(model),
    ...reducers,
  }), redux.reducers || {}))
}

