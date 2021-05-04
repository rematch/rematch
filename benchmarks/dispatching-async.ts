import b from 'benny'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import reduxThunk from 'redux-thunk'
import rematch from '@rematch/core'

const shopReducer = (state, action) => {
	switch (action.type) {
		case 'shop/INCREMENT':
			return { count: state.count + action.payload }
		default:
			return { count: 0 }
	}
}
const reduxStore = createStore(
	combineReducers({
		shop: shopReducer,
	}),
	applyMiddleware(reduxThunk)
)

const commonPromise = () => Promise.resolve(1)

async function asyncReduxAction(dispatch) {
	const result = await commonPromise()
	return dispatch({ type: 'shop/INCREMENT', payload: result })
}
const rematchStore = rematch.init({
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
	'Dispatching async actions',
	b.add('Rematch', async () => rematchStore.dispatch.shop.incrementEffect()),
	// @ts-expect-error
	b.add('Redux', async () => reduxStore.dispatch(asyncReduxAction)),
	b.cycle(),
	b.complete(),
	b.save({ file: 'dispatching-async', version: '2.0.1' }),
	b.save({ file: 'dispatching-async', format: 'chart.html' })
)
