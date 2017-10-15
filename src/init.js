// @flow
import { validateConfig } from './validate'
import { createStore } from './store'
import { createDispatch } from './dispatch'

export const localConfig = {}

/**
 * init
 */
export default (config: $config = {}): void => {
  validateConfig(config)
  createStore(config.initialState, config.middleware, config.extraReducers)
  createDispatch()
}
