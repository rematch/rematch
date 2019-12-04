export const cart = {
	state: [],
	reducers: {
		add: (cart, added) => [...cart, added],
		remove: (cart, removed) => cart.filter(item => item.id !== removed.id),
	},
	selectors: slice => ({
		total() {
			return slice(cart => cart.reduce((t, item) => t + item.value, 0))
		},
		items() {
			return slice
		},
	}),
}
