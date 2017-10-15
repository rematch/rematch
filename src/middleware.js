import { effects } from './effects'
import { matchHooks } from './hooks'

export const createMiddleware = () => middlewareAPI => {
  const getState = middlewareAPI.getState

  return next => action => {
    let result = next(action)

    if (action.type in effects) {
      result = effects[action.type](action.payload, getState)
    }

    matchHooks(action)

    return result
  }
}
