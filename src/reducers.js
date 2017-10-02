import { combineReducers } from 'redux'

let reducers = {}

export const createReducer = nextReducers => {
  const rootReducer = combineReducers({ ...reducers, ...nextReducers })
  reducers = rootReducer
  return reducers
}
