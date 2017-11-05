// @flow
import validate from './utils/validate'
import isObject from './utils/isObject'
import mergeConfig from './utils/mergeConfig'
import { setupPlugins } from './core'


const validateConfig = (config: $config) =>
  validate([
    [
      !!config.plugins && !Array.isArray(config.plugins),
      'init config.plugins must be an array',
    ],
    [
      !!config.models && isObject(config.models),
      'init config.models must be an object'
    ],
    [
      !!config.middleware && !Array.isArray(config.middleware),
      'init config.middleware must be an array',
    ],
    [
      !!config.extraReducers && isObject(config.extraReducers),
      'init config.extraReducers must be an object',
    ],
    [
      !!config.customCombineReducers && typeof config.customCombineReducers !== 'function',
      'init config.customCombineReducers must be a function'
    ],
  ])

const init = (initConfig: $config = {}): void => {
  validateConfig(initConfig)
  const config = mergeConfig(initConfig)
  setupPlugins(config)
}

export default init
