import { IType, undefinedType } from './primitive'

export default class OptionalType implements IType {
	private readonly childType: IType

	constructor(childType: IType) {
		this.childType = childType
	}

	public isValid(thing: any) {
		return undefinedType.isValid(thing) || this.childType.isValid(thing)
	}
}
