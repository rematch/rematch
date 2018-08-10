import { createModel } from '@rematch/core'

import { delay } from '../helpers'

export type SharksState = number

export const sharks = createModel({
	state: 0,
	reducers: {
		increment: (state: SharksState, payload: number): SharksState =>
			state + payload,
	},
	effects: dispatch => ({
		// TODO: Optional args breaks TypeScript autocomplete (e.g. payload: number = 1)
		async incrementAsync(payload: number) {
			await delay(500)
			dispatch.sharks.increment(payload || 1)
		},
	}),
	selectors: slice => ({
		total() {
			return slice
		},
	}),
})
