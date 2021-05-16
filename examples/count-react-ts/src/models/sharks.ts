import { createModel } from '@rematch/core'
import { delay } from './utils'
import type { RootModel } from '.'

export type SharksState = number

export const sharks = createModel<RootModel>()({
	state: 0,
	reducers: {
		increment: (state, payload: number) => state + payload,
	},
	effects: (dispatch) => ({
		async incrementAsync(payload: number): Promise<void> {
			await delay(500)
			dispatch.sharks.increment(payload)
		},
	}),
})
