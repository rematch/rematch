// @flow
import validate from './validate'
/**
 * init
 */
export default (config: $config = {}): void => {
  // validate config options
  validate([
    [!!config.view && typeof config.view !== 'string', 'init config.view must be a string'],
    [!!config.router && typeof config.router !== 'object', 'init config.router must be an object'],
    [!!config.plugins && !Array.isArray(config.plugins), 'init config.plugins must be an array'],
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
}
