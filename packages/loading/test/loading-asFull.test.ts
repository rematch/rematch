/* eslint-disable no-shadow */
import { init } from '@rematch/core'
import loadingPlugin, { ExtraModelsFromLoading } from '../src'
import { delay } from './utils'

describe('loading asFull', () => {
	test('should capture all model and global loading for simultaneous effects', async () => {
		const count2 = {
			state: 0,
			effects: {
				async timeout1(): Promise<void> {
					await delay(200)
				},
				async timeout2(): Promise<void> {
					await delay(200)
				},
			},
			reducers: {},
		}

		type Models = { count: typeof count2 }
		type ExtraModels = ExtraModelsFromLoading<
			Models,
			{
				type: 'full'
			}
		>
		const store = init<Models, ExtraModels>({
			models: { count: count2 },
			plugins: [loadingPlugin({ type: 'full' })],
		})

		const effect1 = store.dispatch.count.timeout1()
		await delay(100)
		const effect2 = store.dispatch.count.timeout2()

		const ld = (): any => store.getState().loading
		// INITIAL LOAD
		expect(ld().effects.count.timeout1).toEqual({
			error: false,
			loading: true,
			success: false,
		})
		expect(ld().effects.count.timeout2).toEqual({
			error: false,
			loading: true,
			success: false,
		})
		expect(ld().models.count).toEqual({
			error: false,
			loading: true,
			success: false,
		})
		expect(ld().global).toEqual({
			error: false,
			loading: true,
			success: false,
		})

		await effect1
		expect(ld().effects.count.timeout1).toEqual({
			error: false,
			loading: false,
			success: true,
		})
		expect(ld().effects.count.timeout2).toEqual({
			error: false,
			loading: true,
			success: false,
		})
		expect(ld().models.count).toEqual({
			error: false,
			loading: true,
			success: true,
		})
		expect(ld().global).toEqual({
			error: false,
			loading: true,
			success: true,
		})

		await effect2
		expect(ld().effects.count.timeout1).toEqual({
			error: false,
			loading: false,
			success: true,
		})
		expect(ld().effects.count.timeout2).toEqual({
			error: false,
			loading: false,
			success: true,
		})
		expect(ld().models.count).toEqual({
			error: false,
			loading: false,
			success: true,
		})
		expect(ld().global).toEqual({
			error: false,
			loading: false,
			success: true,
		})
	})

	test('should capture the error correctly', async () => {
		const count2 = {
			state: 0,
			effects: {
				async success() {
					await delay(100)
				},
			},
			reducers: {},
		}

		type Models = { count: typeof count2 }
		type ExtraModels = ExtraModelsFromLoading<
			Models,
			{
				type: 'full'
			}
		>

		const store = init<Models, ExtraModels>({
			models: { count: count2 },
			plugins: [loadingPlugin({ type: 'full' })],
		})

		await store.dispatch.count.success()
		expect(store.getState().loading.global).toEqual({
			success: true,
			loading: false,
			error: false,
		})
	})

	test('should capture the error correctly', async () => {
		const count2 = {
			state: 0,
			effects: {
				throwError(): void {
					throw new Error('effect error')
				},
			},
			reducers: {},
		}

		type Models = { count: typeof count2 }
		type ExtraModels = ExtraModelsFromLoading<
			Models,
			{
				type: 'full'
			}
		>

		const store = init<Models, ExtraModels>({
			models: { count: count2 },
			plugins: [loadingPlugin({ type: 'full' })],
		})

		try {
			await store.dispatch.count.throwError()
		} catch (err) {
			expect(store.getState().loading).toMatchInlineSnapshot(`
    Object {
      "effects": Object {
        "count": Object {
          "throwError": Object {
            "error": [Error: effect error],
            "loading": false,
            "success": false,
          },
        },
      },
      "global": Object {
        "error": [Error: effect error],
        "loading": false,
        "success": false,
      },
      "models": Object {
        "count": Object {
          "error": [Error: effect error],
          "loading": false,
          "success": false,
        },
      },
    }
  `)
		}
	})
})
