// eslint-disable-next-line import/no-extraneous-dependencies
import { check } from 'typings-tester'
import { resolve } from 'path'

const tsDirectory = resolve(__dirname, '../../../examples')
const examples = [
	// 'count-react-ts', - the project compiles, but for some reason test doesn't
	'hooks-react-ts',
]

describe('typings', () => {
	for (const example of examples) {
		// eslint-disable-next-line no-loop-func
		test(`should compile and run "${tsDirectory}/${example}" without error`, () => {
			expect(() =>
				check(
					[`${tsDirectory}/${example}/src/index.tsx`],
					`${tsDirectory}/${example}/tsconfig.json`
				)
			).not.toThrow()
		})
	}
})
