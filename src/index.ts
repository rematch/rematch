import { Action, Config } from '../typings/rematch'
import Rematch from './rematch'

// allows for global dispatch to multiple stores
const stores = {}

/**
 * init
 * @param config
 */
export const init = (config: Config = {}) => {
  const store = new Rematch(config).init()
  stores[config.name || Object.keys(stores).length] = store
  return store
}

/**
 * global Dispatch
 * @param action
 */
export const dispatch = (action: Action) => {
  for (const name of Object.keys(stores)) {
    stores[name].dispatch(action)
  }
}

/**
 * global getState
 */
export const getState = () => {
  const state = {}
  for (const name of Object.keys(stores)) {
    state[name] = stores[name].getState()
  }
  return state
}

export default {
  dispatch,
  getState,
  init,
}
