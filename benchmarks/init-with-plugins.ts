import b from 'benny'
import { init } from '@rematch/core'

import createLoadingPlugin from '@rematch/loading'
import createUpdatedPlugin from '@rematch/updated'
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
	'init() function with plugins and some configuration',
	b.add('Rematch', () => {
		init({
			models: { shop },
			plugins: [createLoadingPlugin(), createUpdatedPlugin()],
			redux: {
				rootReducers: {
					RESET: () => undefined,
				},
			},
		})
	}),
	b.cycle(),
	b.complete(),
	b.save({ file: 'init-with-plugins', version: pkg.version })
)
