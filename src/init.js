// @flow
import { validateConfig } from './validate'
import { createStore } from './store'
import { registerConnect } from './connect'

/**
 * init
 */
export default (config: $config): void => {
  // validate config options
  validateConfig(config)

  createStore(config.initialState, config.middleware, config.extraReducers)

  registerConnect(config.view)
}
