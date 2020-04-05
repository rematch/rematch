import { Dispatch } from '../store'
import { delay } from './utils'

export type SharksState = number

export const sharks = {
	state: 0,
	reducers: {
		increment: (state: SharksState, payload: number): SharksState =>
			state + payload,
	},
	effects: (dispatch: Dispatch) => ({
		async incrementAsync(payload: number): Promise<void> {
			await delay(500)
			dispatch.sharks.increment(payload)
		},
	}),
}
