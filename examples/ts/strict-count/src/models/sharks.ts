import { Model } from '@rematch/core'
import { delay } from '../helpers'
import { RootDispatch, RootState } from '../store'

export type SharksState = number

const model: Model<SharksState> = {
	state: 0,
	reducers: {
		increment: (state: SharksState, payload: number): SharksState =>
			state + payload,
	},
	effects: (dispatch: RootDispatch) => ({
		// support autocomplete now
		incrementAsync: async function(payload: number, rootState: RootState) {
			await delay(500)
			dispatch.sharks.increment(payload || rootState.sharks)
		},
	}),
}

export const sharks: typeof model = model
