import { Validation } from '../typings'

/**
 * Validate
 *
 * takes an array of arrays of validations and
 * throws if an error occurs
 */
/* istanbul ignore next */
const validate = (validations: Validation[]): void => {
  validations.forEach((validation: Validation) => {
    const condition = validation[0]
    const errorMessage = validation[1]
    if (condition) {
      throw new Error(errorMessage)
    }
  })
}

export default validate
