/**
 * Access deeply nested values in the given object
 * @param {any} thing source object
 * @param {string[]} path array of nested property names
 *
 * @example
 * dig({ name: 'Jon', address: { country: { code: 'US' } } }, ['address', 'coutry', 'code'])
 */
export function dig(thing: any, path: string[]) {
	return path.reduce((acc, part) => acc ? acc[part] : undefined, thing)
}
