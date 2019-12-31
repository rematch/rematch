/* eslint-disable no-loop-func */
// eslint-disable-next-line import/no-extraneous-dependencies
import { check } from 'typings-tester'
import path from 'path'

const tsDirectory = path.resolve(__dirname, '../../../examples/ts')
const examples = ['count', 'hooks']

describe('typings', () => {
  for (const example of examples) {
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
