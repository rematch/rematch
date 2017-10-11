// @flow
import { validateConfig } from './validate'
import { createStore } from './store'
import { registerViewImplementation } from './view'

/**
 * init
 */
export default (config: $config = {}): void => {
  validateConfig(config)
  createStore(config.initialState, config.middleware, config.extraReducers)

  if (config.view) {
    registerViewImplementation(config.view)
  }
}
