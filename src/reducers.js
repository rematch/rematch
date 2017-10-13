// @flow
import { combineReducers } from 'redux'

let _reducers: $reducers // eslint-disable-line

export const initReducers = () : void => {
  _reducers = {}
}

// get reducer for given dispatch type
// pass in (state, payload)
export const getReducer = (reducer: $reducers, initialState: any = null) => (
  state: any = initialState,
  action: $action,
) => {
  if (typeof reducer[action.type] === 'function') {
    return reducer[action.type](state, action.payload)
  }
  return state
}

// adds "model/reducer" names to
export const resolveReducers = (modelName: string, reducers: $reducers = {}) =>
  Object.keys(reducers).reduce((acc, reducer) => {
    acc[`${modelName}/${reducer}`] = reducers[reducer]
    return acc
  }, {})

// creates a reducer out of "reducers" keys and values
export const createReducers = ({ name, reducers, state }: $model) =>
  getReducer(resolveReducers(name, reducers), state)

// uses combineReducers to merge new reducers into existing reducers
export const mergeReducers = (nextReducers: $reducers) => {
  _reducers = { ..._reducers, ...nextReducers }
  return combineReducers(_reducers)
}
