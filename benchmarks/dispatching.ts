import b from 'benny'
import rematch from '@rematch/core'
import pkg from '../packages/core/package.json'

const rematchStore = rematch.init({
	models: {
		shop: {
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
		},
	},
})

b.suite(
	'Dispatching actions',
	b.add('Rematch', () => {
		rematchStore.dispatch.shop.increment()
	}),
	b.cycle(),
	b.complete(),
	b.save({ file: 'dispatching', version: pkg.version })
)
