const { check, checkDirectory } = require('typings-tester')

const tsDirectory = 'examples/ts'
const examples = ['count']

describe('typings', () => {
	for (const example of examples) {
		test('should run example', () => {
			expect(
				check(
					[`./${tsDirectory}/${example}/src/index.tsx`],
					`./${tsDirectory}/${example}/tsconfig.json`
				)
			).not.toThrow()
		})
	}
})
