import { dispatch } from '@rematch/core'

export const count = {
	state: 0,
	reducers: {
		increment: s => s + 1,
	},
	effects: dispatch => ({
		asyncIncrement: async () => {
			await new Promise(resolve => {
				setTimeout(resolve, 1000)
			})
			dispatch.count.increment()
		},
	}),
}
