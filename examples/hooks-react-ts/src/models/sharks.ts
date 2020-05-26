import { createModel } from '@rematch/core'
import { delay } from './utils'
import { Dispatch } from '../store'

export type SharksState = number

export const sharks = createModel<SharksState>()({
	state: 0,
	reducers: {
		increment: (state, payload: number) =>
			state + payload,
	},
	effects: (dispatch) => ({
		async incrementAsync(payload: number): Promise<void> {
			const typedDispatch = dispatch as Dispatch
			await delay(500)
			typedDispatch.sharks.increment(payload)
		},
	}),
});
