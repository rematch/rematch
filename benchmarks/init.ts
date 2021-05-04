import b from 'benny'
import { init } from '@rematch/core'

import pkg from '../packages/core/package.json'

const shop = {
	state: {
		count: 0,
	},
	reducers: {
		increment(state) {
			return {
				count: state.count + 1,
			}
		},
	},
}
b.suite(
	'init() function initializer',
	b.add('Rematch', () => {
		init({
			models: { shop },
		})
	}),
	b.cycle(),
	b.complete(),
	b.save({ file: 'init', version: pkg.version })
)
