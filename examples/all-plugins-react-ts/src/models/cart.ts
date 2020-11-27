import { createModel } from '@rematch/core'
import { RootModel } from '.'
import { RootState } from '../store'

interface CartState {
	price: number
	amount: number
	productId: number
}

export const cart = createModel<RootModel>()({
	state: [
		{
			price: 42.0,
			amount: 3,
			productId: 2,
		},
	] as CartState[],
	selectors: (slice, createSelector, hasProps) => ({
		// creates a simple memoized selector based on the cart state
		total() {
			return slice((cart) => cart.reduce((a, b) => a + b.price * b.amount, 0))
		},
		// uses createSelector method to create more complex memoized selector
		totalWithShipping() {
			return createSelector(
				// IMP: `slice` is a `Selector` and `(rootState, props) => props.shipping` is an `ParametricSelector`. In reselect, there are no overloads for it.
				slice, // shortcut for (rootState) => rootState.cart
				(rootState: any, props: any) => props.shipping as number,
				(cart, shipping) =>
					cart.reduce((a, b) => a + b.price * b.amount, shipping)
			)
		},
		// refers to the other selector from this model
		doubleTotal() {
			return createSelector(
				this.totalWithShipping(),
				(totalWithShipping) => totalWithShipping * 2
			)
		},
		// accesses selector from a different model
		// productsPopularity(models, a) {
		// 	return createSelector(
		// 		slice, // shortcut for (rootState) => rootState.cart
		// 		models.popularity.pastDay, // gets 'pastDay' selector from 'popularity' model
		// 		(cart, hot) => cart.sort((a, b) => hot[a.productId] - hot[b.productId])
		// 	)
		// },
		// uses hasProps function, which returns new selector for each given lowerLimit prop
		expensiveFilter: hasProps(function (models, lowerLimit) {
			return slice((items) => items.filter((item) => item.price > lowerLimit))
		}),
		// uses expensiveFilter selector to create a new selector where lowerLimit is set to 20.00
		// wouldGetFreeShipping(models) {
		// 	return this.expensiveFilter(models, 20.0)
		// },
	}),
})
