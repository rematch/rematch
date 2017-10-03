// @flow
import { validateConfig } from './validate'
import { createStore } from './store'

/**
 * init
 */
export default (config: $config = {}): void => {
  // validate config options
  validateConfig(config)

  createStore(config.initialState, config.middleware, config.extraReducers)
}
