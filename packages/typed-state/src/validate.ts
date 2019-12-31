/* eslint-disable @typescript-eslint/no-explicit-any,no-prototype-builtins,no-console */
import ReactPropTypesSecret from 'prop-types/lib/ReactPropTypesSecret'

const validateState = (typeSpecs: any, values: any, modelName: string) => {
  if (process.env.NODE_ENV !== 'production') {
    for (const typeSpecName in typeSpecs) {
      if (typeSpecs.hasOwnProperty(typeSpecName)) {
        const error = typeSpecs[typeSpecName](
          values,
          typeSpecName,
          modelName,
          'property',
          null,
          ReactPropTypesSecret
        )

        if (error instanceof Error) {
          console.warn(`[rematch] ${error.message}`)
        }
      }
    }
  }
}

export default validateState
