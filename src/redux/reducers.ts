/* eslint no-underscore-dangle: 0 */
import { combineReducers, Reducer} from 'redux'
import { Action, ConfigRedux, Model, Reducers } from '../typings/rematch'

let combine: (Reducers) => Reducer<any> = combineReducers

let allReducers: Reducers = {}

// get reducer for given dispatch type
// pass in (state, payload)
export const getReducer = (reducer: Reducers, initialState: any) =>
  (state: any = initialState, action: Action) => {
  if (typeof reducer[action.type] === 'function') {
    return reducer[action.type](state, action.payload)
  }
  return state
}

// creates a reducer out of "reducers" keys and values
export const createModelReducer = ({ name, reducers, state }: Model) => {
  const modelReducers: Reducers = Object.keys(reducers || {}).reduce((acc, reducer) => {
    acc[`${name}/${reducer}`] = reducers[reducer]
    return acc
  }, {})
  return {
    [name]: getReducer(modelReducers, state),
  }
}

// uses combineReducers to merge new reducers into existing reducers
export const mergeReducers = (nextReducers: Reducers = {}) => {
  allReducers = { ...allReducers, ...nextReducers }
  if (!Object.keys(allReducers).length) {
    return (state) => state
  }
  return combine(allReducers)
}

export const initReducers = (models: Model[], redux: ConfigRedux): void => {
  // optionally overwrite combineReducers on init
  combine = redux.combineReducers || combine

  // combine existing reducers, redux.reducers & model.reducers
  mergeReducers(models.reduce((reducers, model) => ({
    ...createModelReducer(model),
    ...reducers,
  }), redux.reducers))
}
