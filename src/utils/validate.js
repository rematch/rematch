// @flow

type $validation = Array<boolean | string>

/**
 * Validate
 *
 * takes an array of arrays of validations and
 * throws if an error occurs
 */
/* istanbul ignore next */
const validate = (validations: Array<$validation>): void => {
  if (process.env.NODE_ENV !== 'production') {
    validations.forEach((validation: $validation) => {
      const [condition: boolean, errorMessage: string] = validation
      if (condition) {
        throw new Error(errorMessage)
      }
    })
  }
}

export default validate
