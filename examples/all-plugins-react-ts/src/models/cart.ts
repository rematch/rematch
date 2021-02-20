import { createModel } from '@rematch/core'
import type { RootModel } from '.'

export const cart = createModel<RootModel>()({
	state: {
		taxPercent: 8,
		items: [
			{ name: 'apple', value: 1.2 },
			{ name: 'orange', value: 0.95 },
		],
	},
	selectors: (slice, createSelector) => ({
		shopItemsSelector() {
			return slice((cart) => cart.items)
		},
		taxPercentSelector() {
			return slice((cart) => cart.taxPercent)
		},
		subTotalSelector() {
			return createSelector(this.shopItemsSelector, (items) =>
				(items as any).reduce(
					(subtotal: number, item: { name: string; value: number }) =>
						subtotal + item.value,
					0
				)
			)
		},
		taxSelector() {
			return createSelector(
				this.subTotalSelector,
				this.taxPercentSelector,
				(subtotal: any, taxPercent: any) => subtotal * (taxPercent / 100)
			)
		},
		totalSelector() {
			return createSelector(
				this.subTotalSelector,
				this.taxSelector,
				(subtotal: any, tax: any) => ({ total: subtotal + tax })
			)
		},
	}),
})
