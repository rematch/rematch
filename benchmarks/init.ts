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

b.suite(
	'Dispatching actions',
	b.add('Rematch', () => {
		rematch.init({
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
	}),
	b.add('Redux', () => {
		createStore(
			combineReducers({
				shop: shopReducer,
			})
		)
	}),
	b.cycle(),
	b.complete(),
	b.save({ file: 'init', version: '2.0.1' }),
	b.save({ file: 'init', format: 'chart.html' })
)
