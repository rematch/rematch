import { init, ModelDispatcher } from '@rematch/core'
import { Models } from '@rematch/core/src'
import updatedPlugin, { ExtraModelsFromUpdated } from '../src'

const mockDate = new Date()

type CountModel = {
	state: number
	reducers: {
		addOne(s: number): number
	}
	effects: {
		timeout(): void
	}
}

interface RootModel extends Models<RootModel> {
	[key: string]: CountModel
}

describe('updated', () => {
	test('should setup with a config name', async () => {
		const count: CountModel = {
			state: 0,
			reducers: {
				addOne: (s: number): number => s + 1,
			},
			effects: {
				timeout(this: ModelDispatcher<CountModel, RootModel>): void {
					this.addOne()
				},
			},
		}

		const store = init({
			models: { count },
			plugins: [
				updatedPlugin({
					name: 'chicken',
					dateCreator: (): Date => mockDate,
				}),
			],
		})

		store.dispatch.count.timeout()

		const state = store.getState()
		expect(state).toEqual({
			count: 1,
			chicken: {
				count: {
					timeout: mockDate,
				},
			},
		})
	})

	test('should record the timestamp of the last time an effect was updated', async () => {
		const count: CountModel = {
			state: 0,
			reducers: {
				addOne: (s: number): number => s + 1,
			},
			effects: {
				timeout(this: ModelDispatcher<CountModel, RootModel>): void {
					this.addOne()
				},
			},
		}

		const store = init({
			models: { count },
			plugins: [
				updatedPlugin({
					dateCreator: () => mockDate,
				}),
			],
		})

		store.dispatch.count.timeout()

		const state = store.getState()
		expect(state).toEqual({
			count: 1,
			updated: {
				count: {
					timeout: mockDate,
				},
			},
		})
	})

	test('should work with multiple effects', async () => {
		type AsyncCountModel = {
			state: number
			reducers: {
				addOne(s: number): number
			}
			effects: {
				timeout(): Promise<void>
				timeout2(): Promise<void>
			}
		}

		const count: AsyncCountModel = {
			state: 0,
			reducers: {
				addOne: (s: number): number => s + 1,
			},
			effects: {
				async timeout(
					this: ModelDispatcher<AsyncCountModel, RootModel>
				): Promise<void> {
					this.addOne()
				},
				async timeout2(
					this: ModelDispatcher<AsyncCountModel, RootModel>
				): Promise<void> {
					this.addOne()
				},
			},
		}

		type RootModel = {
			count: AsyncCountModel
		}

		type ExtraModels = ExtraModelsFromUpdated<ExtraModels & RootModel>

		const store = init<RootModel, ExtraModels>({
			models: { count },
			plugins: [updatedPlugin({ dateCreator: () => mockDate })],
		})

		await store.dispatch.count.timeout()
		await store.dispatch.count.timeout2()

		const state = store.getState()
		expect(state).toEqual({
			count: 2,
			updated: {
				count: {
					timeout: mockDate,
					timeout2: mockDate,
				},
			},
		})
	})
})
