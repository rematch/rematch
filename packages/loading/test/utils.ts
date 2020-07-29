/* eslint-disable import/no-extraneous-dependencies */
import { ModelDispatcher } from '@rematch/core'

export const delay = (ms: number): Promise<void> =>
	new Promise((r) => setTimeout(r, ms))

type CountModel = {
	state: number
	reducers: {
		addOne(s: number): number
	}
	effects: {
		timeout(): Promise<void>
	}
}

export const count: CountModel = {
	state: 0,
	reducers: {
		addOne: (s: number): number => s + 1,
	},
	effects: {
		async timeout(this: ModelDispatcher<CountModel>): Promise<void> {
			await delay(200)
			await this.addOne()
		},
	},
}
