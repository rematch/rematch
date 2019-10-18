import { delay } from '../helpers'
import { RootDispatch, RootState } from '../store'

export type SharksState = number

export const sharks = {
	state: 0,
	reducers: {
		increment: (state: SharksState, payload: number): SharksState =>
			state + payload,
	},
	effects: (dispatch: RootDispatch) => ({
		// support autocomplete now
		async incrementAsync(payload: number, rootState: RootState) {
			await delay(500)
			dispatch.sharks.increment(payload || rootState.sharks)
		},
	}),
}
