// @flow
import { validateConfig } from './validate'
import { createStore } from './store'
import { initPlugins } from './plugins'

/**
 * init
 */
export default (config: $config = {}): void => {
  validateConfig(config)
  initPlugins(config.plugins)
  createStore(config.initialState, config.extraReducers)
}
