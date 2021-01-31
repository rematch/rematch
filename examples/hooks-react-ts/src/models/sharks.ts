import { createModel } from '@rematch/core'
import { delay } from './utils'
import { RootModel } from '.'

export const sharks = createModel<RootModel>()({
	state: 0,
	reducers: {
		increment: (state, payload: number) => state + payload,
	},
	effects: (dispatch) => ({
		async incrementAsync(payload: number) {
			await delay(500)
			dispatch.sharks.increment(payload)
		},
	}),
})
