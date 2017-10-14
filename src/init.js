// @flow
import { validateConfig } from './validate'
import { createStore } from './store'

/**
 * init
 */
export default (config: $config = {}): void => {
  validateConfig(config)
  createStore(config.initialState, config.middleware, config.extraReducers)
}
