// @flow
import { combineReducers } from 'redux'

let reducers = {}

export const getReducer = (reduce, initialState = null) => {
  return (state = initialState, action) => {
    if (typeof reduce[action.type] === 'function') {
      return reduce[action.type](state, action.data)
    }
    return state
  }
}

export const resolveReducers = (modelName, reduce = {}) => {
  return Object.keys(reduce).reduce((acc, cur) => {
    acc[`${modelName}/${cur}`] = reduce[cur]
    return acc
  }, {})
}

export const createReducers = ({ name, reduce = {}, state = null }) => {
  console.log(name, reduce, state)
  return getReducer(resolveReducers(name, reduce), state)
}


export const mergeReducer = nextReducers => {
  const rootReducer = combineReducers({ ...reducers, ...nextReducers })
  reducers = rootReducer
  return reducers
}

