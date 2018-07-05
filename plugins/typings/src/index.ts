import parseType from './types/parser'
import { dig } from './utils'

class InvalidValue {
	public readonly prop: string
	public readonly expectedType: string
	public readonly value: any

	constructor(prop: string, expectedType: string, value: any) {
		this.prop = prop
		this.expectedType = expectedType
		this.value = value
	}
}

interface ITypings {
	[key: string]: any,
}

interface ITypedState {
	state: any,
	typings: ITypings,
}

function traverse(thing: any, typings: ITypings, errors: InvalidValue[], path: string[] = []) {
	const current = dig(thing, path)
	if (typeof current === 'object' && !(current instanceof Date)) {
		for (const key in current) {
			if (current.hasOwnProperty(key))	{
				traverse(thing, typings, errors, path.concat(key))
			}
		}
	} else {
		const expectedType = dig(typings, path)
		const typeChecker = parseType(expectedType)
		if (!typeChecker.isValid(current)) {
			errors.push(new InvalidValue(path.join('.'), expectedType, current))
		}
	}
}

export default function validate(config: ITypedState) {
	const errors: InvalidValue[] = []
	traverse(config.state, config.typings, errors)
	errors.forEach(error => {
		console.warn(`Property ${error.prop} is invalid. Expected: ${error.expectedType}, got ${typeof error.value}`)
	})
}
