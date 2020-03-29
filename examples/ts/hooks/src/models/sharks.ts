import { delay } from '../helpers'
import { Dispatch } from '../store'

export type SharksState = number

export const sharks = {
	state: 0,
	reducers: {
		increment: (state: SharksState, payload: number): SharksState =>
			state + payload,
	},
	effects: (dispatch: Dispatch) => ({
		// TODO: Optional args breaks TypeScript autocomplete (e.g. payload: number = 1)
		async incrementAsync(payload: number) {
			await delay(500)
			dispatch.sharks.increment(payload || 1)
		},
	}),
}
