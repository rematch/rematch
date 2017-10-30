// @flow
import validate from './utils/validate'
import { setupPlugins } from './core'

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
      !!config.extraReducers && (Array.isArray(config.extraReducers) || typeof config.extraReducers !== 'object'),
      'init config.extraReducers must be an object',
    ],
    [
      !!config.customCombineReducers && typeof config.customCombineReducers !== 'function',
      'init config.customCombineReducers must be a function'
    ],
  ])

const init = (config: $config = {}): void => {
  validateConfig(config)
  setupPlugins(config)
}

export default init
