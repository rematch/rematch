interface IType {
  isValid(thing: any): boolean
}

class PrimitiveType implements IType {
  private readonly checker: (v: any) => boolean

  constructor(checker: (v: any) => boolean) {
    this.checker = checker
  }

  isValid(thing: any) {
    return this.checker(thing)
  }
}

const stringType = new PrimitiveType(v => typeof v === 'string')
const numberType = new PrimitiveType(v => typeof v === 'number')
const booleanType = new PrimitiveType(v => typeof v === 'boolean')
const dateType = new PrimitiveType(v => typeof v === 'number' || v instanceof Date)
const undefinedType = new PrimitiveType(v => v === undefined)

class OptionalType implements IType {
  private readonly childType: IType

  constructor(childType: IType) {
    this.childType = childType
  }

  isValid(thing: any) {
    return undefinedType.isValid(thing) || this.childType.isValid(thing)
  }
}

class UnionType implements IType {
  readonly types: IType[]

  constructor(types: IType[]) {
    this.types = types
  }

  isValid(thing: any) {
    return this.types.some((fn) => fn.isValid(thing))
  }
}

function parseType(typeString: string): IType {
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
        throw new Error("Unknown type: " + parts[0])
    }
  }
}

interface ITypings {
  [key: string]: any,
}

interface ITypedState {
  state: any,
  typings: ITypings,
}

class InvalidValue {
  readonly prop: string
  readonly expectedType: string
  readonly value: any

  constructor(prop: string, expectedType: string, value: any) {
    this.prop = prop
    this.expectedType = expectedType
    this.value = value
  }
}

function dig(thing: any, path: string[]) {
  return path.reduce((acc, part) => acc ? acc[part] : undefined, thing)
}

function traverse(thing: any, typings: ITypings, errors: InvalidValue[], path: string[] = []) {
  const current = dig(thing, path)
  if (typeof current === 'object' && !(current instanceof Date)) {
    for (let i in current) {
      traverse(thing, typings, errors, path.concat(i))
    }
  } else {
    const expectedType = dig(typings, path)
    const typeChecker = parseType(expectedType)
    if (!typeChecker.isValid(current)) {
      errors.push(new InvalidValue(path.join('.'), expectedType, current))
    }
  }
}

function validate(config: ITypedState) {
  const errors: InvalidValue[] = []
  traverse(config.state, config.typings, errors)
  errors.forEach(error => {
    console.warn(`Property ${error.prop} is invalid. Expected: ${error.expectedType}, got ${typeof error.value}`)
  })
}
