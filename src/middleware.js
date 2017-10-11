import { effect } from './effect'

export const createMiddleware = () => middlewareAPI => {
  const getState = middlewareAPI.getState

  return next => action => {
    let result = next(action)

    if (action.type in effect) {
      result = effect[action.type](action.payload, getState)
    }

    return result
  }
}
