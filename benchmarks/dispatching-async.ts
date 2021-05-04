import b from 'benny'
import { init } from '@rematch/core'
import pkg from '../packages/core/package.json'

const commonPromise = () => Promise.resolve(1)
const rematchStore = init({
	models: {
		shop: {
			state: {
				count: 0,
			},
			reducers: {
				increment(state, payload) {
					return {
						count: state.count + payload,
					}
				},
			},
			effects: () => ({
				async incrementEffect() {
					const result = await commonPromise()
					this.increment(result)
				},
			}),
		},
	},
})

b.suite(
	'Dispatching asynchronous actions',
	b.add('Rematch', async () => rematchStore.dispatch.shop.incrementEffect()),
	b.cycle(),
	b.complete(),
	b.save({ file: 'dispatching-async', version: pkg.version })
)
