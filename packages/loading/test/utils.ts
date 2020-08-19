/* eslint-disable import/no-extraneous-dependencies */
import { ModelDispatcher, Models } from '@rematch/core'

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

interface RootModel extends Models<RootModel> {
	count: CountModel
}

export const count: CountModel = {
	state: 0,
	reducers: {
		addOne: (s: number): number => s + 1,
	},
	effects: {
		async timeout(this: ModelDispatcher<CountModel, RootModel>): Promise<void> {
			await delay(200)
			await this.addOne()
		},
	},
}
