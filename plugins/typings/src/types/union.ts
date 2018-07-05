import { IType } from './primitive'

export default class UnionType implements IType {
	private readonly types: IType[]

	constructor(types: IType[]) {
		this.types = types
	}

	public isValid(thing: any) {
		return this.types.some((fn) => fn.isValid(thing))
	}
}
