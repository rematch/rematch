type validation = [boolean, string]

/**
 * Validate
 *
 * takes an array of arrays of validations and
 * throws if an error occurs
 */
/* istanbul ignore next */
const validate = (validations: Array<validation>): void => {
  validations.forEach((validation: validation) => {
    const condition = validation[0]
    const errorMessage = validation[1]
    if (condition) {
      throw new Error(errorMessage)
    }
  })
}

export default validate
