import * as R from '../typings/rematch'
import Rematch from './rematch'
import mergeConfig from './utils/mergeConfig'

// allows for global dispatch to multiple stores
const stores = {}

/**
 * init
 * @param config
 */
export const init = (initConfig: R.InitConfig = {}): R.RematchStore => {
  const name = initConfig.name || Object.keys(stores).length.toString()
  const config: R.Config = mergeConfig({ ...initConfig, name })
  const store = new Rematch(config).init()
  stores[name] = store
  return store
}

/**
 * global Dispatch
 * @param action
 */
export const dispatch = (action: R.Action) => {
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
