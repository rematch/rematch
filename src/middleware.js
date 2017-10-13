import { effects } from './effects'

export const createMiddleware = () => middlewareAPI => {
  const getState = middlewareAPI.getState

  return next => action => {
    let result = next(action)

    if (action.type in effects) {
      result = effects[action.type](action.payload, getState)
    }

    return result
  }
}
