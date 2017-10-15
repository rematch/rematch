// @flow

type $validation = Array<boolean | string>

/**
 * Validate
 * 
 * takes an array of arrays of validations and
 * throws if an error occurs
 */
const validate = (validations: Array<$validation>): void => {
  validations.forEach((validation: $validation) => {
    const [condition: boolean, errorMessage: string] = validation
    if (condition) {
      throw new Error(errorMessage)
    }
  })
}

export const validateConfig = (config: $config) =>
  validate([
    [
      !!config.router && typeof config.router !== 'object',
      'init config.router must be an object',
    ],
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

export const validateModel = (model: $model) =>
  validate([
    [!model, 'model config is required'],
    [
      !model.name || typeof model.name !== 'string',
      'model "name" [string] is required',
    ],
    [model.state === undefined, 'model "state" is required'],
  ])
