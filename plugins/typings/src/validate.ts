// tslint:disable no-empty, no-var-requires
const ReactPropTypesSecret = require('prop-types/lib/ReactPropTypesSecret')

const validateState = (typeSpecs: any, values: any) => {
	if (process.env.NODE_ENV !== 'production') {
		for (const typeSpecName in typeSpecs) {
			if (typeSpecs.hasOwnProperty(typeSpecName)) {
				const error = typeSpecs[typeSpecName](values, typeSpecName, 'RematchStore', 'property', null, ReactPropTypesSecret)

				if (error instanceof Error) {
					console.warn(error.message)
				}
			}
		}
	}
}

export default validateState
