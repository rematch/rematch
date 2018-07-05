import OptionalType from './optional'
import { booleanType, dateType, IType, numberType, stringType } from './primitive'
import UnionType from './union'

/**
 * @param {string} typeString - string representing expected type
 * @returns {IType} parsed type instance
 */
export default function parseType(typeString: string): IType {
	const parts = typeString.split('|').map(s => s.trim())

	if (parts.length > 1) {

		const childTypes = parts.map(childType => parseType(childType))
		return new UnionType(childTypes)

	} else if (parts[0].slice(-1) === '?') {

		const childType = parseType(parts[0].slice(0, -1))
		return new OptionalType(childType)

	} else {

		switch (parts[0]) {
			case 'string':
				return stringType
			case 'number':
				return numberType
			case 'boolean':
				return booleanType
			case 'date':
				return dateType
			default:
				throw new Error('Unknown type: ' + parts[0])
		}
	}
}
