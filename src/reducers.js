// @flow
import { combineReducers } from 'redux'

let reducers: $reducers

export const initReducers = () : void => {
  reducers = {}
}

// get reducer for given dispatch type
// pass in (state, payload)
export const getReducer = (reduce: $reducers, initialState: any = null) => (
  state: any = initialState,
  action: $action,
) => {
  if (typeof reduce[action.type] === 'function') {
    return reduce[action.type](state, action.payload)
  }
  return state
}

// adds "model/reducer" names to
export const resolveReducers = (modelName: string, reduce: $reducers = {}) =>
  Object.keys(reduce).reduce((acc, reducer) => {
    acc[`${modelName}/${reducer}`] = reduce[reducer]
    return acc
  }, {})

// creates a reducer out of "reduce" keys and values
export const createReducers = ({ name, reduce, state }: $model) =>
  getReducer(resolveReducers(name, reduce), state)

// uses combineReducers to merge new reducers into existing reducers
export const mergeReducers = (nextReducers: $reducers) => {
  reducers = { ...reducers, ...nextReducers }
  return combineReducers(reducers)
}
