import { init } from '../../../../src'
import plugin from './redux-immutable'

describe('reduxImmutable:', () => {
	test('creates a store with ported plugin', () => {
		const start = () =>
			init({
				plugins: [plugin()],
			})
		expect(start).not.toThrow()
	})
})
