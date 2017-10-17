// @flow
import validate from './utils/validate'
import { createStore } from './redux/store'
import createPlugins from './core'

const validateConfig = (config: $config) =>
  validate([
    [
      !!config.plugins && !Array.isArray(config.plugins),
      'init config.plugins must be an array',
    ],
    [
      !!config.middleware && !Array.isArray(config.middleware),
      'init config.middleware must be an array',
    ],
    [
      !!config.extraReducers && typeof config.extraReducers !== 'object',
      'init config.extraReducers must be an object',
    ],
    [
      !!config.onError && typeof config.onError !== 'function',
      'init config.onError must be a function',
    ],
  ])

/**
 * init
 */
export default (config: $config = {}): void => {
  validateConfig(config)
  createPlugins(config.plugins)
  createStore(config.initialState, config.extraReducers)
}

