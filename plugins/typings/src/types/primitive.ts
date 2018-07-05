export interface IType {
	isValid(thing: any): boolean
}

export class PrimitiveType implements IType {
	private readonly checker: (v: any) => boolean

	constructor(checker: (v: any) => boolean) {
		this.checker = checker
	}

	public isValid(thing: any) {
		return this.checker(thing)
	}
}

export const stringType = new PrimitiveType(v => typeof v === 'string')
export const numberType = new PrimitiveType(v => typeof v === 'number')
export const booleanType = new PrimitiveType(v => typeof v === 'boolean')
export const dateType = new PrimitiveType(v => typeof v === 'number' || v instanceof Date)
export const undefinedType = new PrimitiveType(v => v === undefined)
