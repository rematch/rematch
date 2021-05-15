import b from 'benny'
import { createStore, combineReducers } from 'redux'
import rematch from '@rematch/core'

const shopReducer = (state, action) => {
	switch (action.type) {
		case 'shop/INCREMENT':
			return { count: state.count + 1 }
		default:
			return { count: 0 }
	}
}
const reduxStore = createStore(
	combineReducers({
		shop: shopReducer,
	})
)
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
	b.add('Redux', () => {
		reduxStore.dispatch({ type: 'shop/INCREMENT' })
	}),
	b.cycle(),
	b.complete(),
	b.save({ file: 'dispatching', version: '2.0.1' }),
	b.save({ file: 'dispatching', format: 'chart.html' })
)
