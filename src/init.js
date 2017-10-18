// @flow
import validate from './utils/validate'
import { createStore } from './utils/store'
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

const init = (config: $config = {}): void => {
  validateConfig(config)
  // setup plugin pipeline
  createPlugins(config.plugins)
  // create a redux store with initialState
  // merge in additional extra reducers
  createStore(config.initialState, config.extraReducers)
}

export default init
