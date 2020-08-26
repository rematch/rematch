/* eslint-disable import/no-extraneous-dependencies */
import { ModelDispatcher, Models as RematchModels } from '@rematch/core'
import { ExtraModelsFromLoading } from '../src'

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

interface RootModel extends RematchModels<RootModel> {
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

export type Models = { count: typeof count }

export type ExtraModels = ExtraModelsFromLoading<Models & ExtraModels>
