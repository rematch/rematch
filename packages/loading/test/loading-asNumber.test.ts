/* eslint-disable no-shadow */
import { init } from '@rematch/core'
import loadingPlugin, { ExtraModelsFromLoading } from '../src'
import { delay, count, Models } from './utils'

type ExtraModels = ExtraModelsFromLoading<Models, { asNumber: true }>

describe('loading asNumbers', () => {
	test('loading.global should be 0 for normal dispatched action', () => {
		const store = init<Models, ExtraModels>({
			models: { count },
			plugins: [loadingPlugin({ asNumber: true })],
		})

		store.dispatch.count.addOne()
		expect(store.getState().loading.global).toBe(0)
	})

	test('loading.global should be 1 for a dispatched effect', () => {
		const store = init<Models, ExtraModels>({
			models: { count },
			plugins: [loadingPlugin({ asNumber: true })],
		})

		store.dispatch.count.timeout()
		expect(store.getState().loading.global).toBe(1)
	})

	test('loading.global should be 2 for two dispatched effects', () => {
		const store = init<Models, ExtraModels>({
			models: { count },
			plugins: [loadingPlugin({ asNumber: true })],
		})

		store.dispatch.count.timeout()
		store.dispatch.count.timeout()

		expect(store.getState().loading.global).toBe(2)
	})

	test('should set loading.models[name] to 0', () => {
		const store = init<Models, ExtraModels>({
			models: { count },
			plugins: [loadingPlugin({ asNumber: true })],
		})

		expect(store.getState().loading.models.count).toBe(0)
	})

	test('should change the loading.models to 1', () => {
		const store = init<Models, ExtraModels>({
			models: { count },
			plugins: [loadingPlugin({ asNumber: true })],
		})

		store.dispatch.count.timeout()
		expect(store.getState().loading.models.count).toBe(1)
	})

	test('should change the loading.models to 2', () => {
		const store = init<Models, ExtraModels>({
			models: { count },
			plugins: [loadingPlugin({ asNumber: true })],
		})

		store.dispatch.count.timeout()
		store.dispatch.count.timeout()
		expect(store.getState().loading.models.count).toBe(2)
	})

	test('should set loading.effects[name] to object of effects', () => {
		const store = init<Models, ExtraModels>({
			models: { count },
			plugins: [loadingPlugin({ asNumber: true })],
		})
		expect(store.getState().loading.effects.count.timeout).toBe(0)
	})

	test('should change the loading.effects to 1', () => {
		const store = init<Models, ExtraModels>({
			models: { count },
			plugins: [loadingPlugin({ asNumber: true })],
		})

		store.dispatch.count.timeout()
		expect(store.getState().loading.effects.count.timeout).toBe(1)
	})

	test('should change the loading.effects to 2', () => {
		const store = init<Models, ExtraModels>({
			models: { count },
			plugins: [loadingPlugin({ asNumber: true })],
		})

		store.dispatch.count.timeout()
		store.dispatch.count.timeout()
		expect(store.getState().loading.effects.count.timeout).toBe(2)
	})

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
		type ExtraModels = ExtraModelsFromLoading<Models, { asNumber: true }>

		const store = init<Models, ExtraModels>({
			models: { count: count2 },
			plugins: [loadingPlugin({ asNumber: true })],
		})

		const effect1 = store.dispatch.count.timeout1()
		await delay(100)
		const effect2 = store.dispatch.count.timeout2()

		const ld = () => store.getState().loading
		expect(ld().effects.count.timeout1).toBe(1)
		expect(ld().effects.count.timeout2).toBe(1)
		expect(ld().models.count).toBe(2)
		expect(ld().global).toBe(2)

		await effect1
		expect(ld().effects.count.timeout1).toBe(0)
		expect(ld().effects.count.timeout2).toBe(1)
		expect(ld().models.count).toBe(1)
		expect(ld().global).toBe(1)

		await effect2
		expect(ld().effects.count.timeout1).toBe(0)
		expect(ld().effects.count.timeout2).toBe(0)
		expect(ld().models.count).toBe(0)
		expect(ld().global).toBe(0)
	})

	test('should configure the loading name to "foobar"', () => {
		const store = init<Models, ExtraModels>({
			models: { count },
			plugins: [loadingPlugin({ asNumber: true, name: 'foobar' })],
		})

		store.dispatch.count.addOne()
		expect(store.getState().foobar.global).toBe(0)
	})

	test('should throw if loading name is not a string', () => {
		const createStore = () =>
			init<Models, ExtraModels>({
				models: { count },
				plugins: [
					// @ts-expect-error
					loadingPlugin({
						asNumber: true,
						// @ts-expect-error
						name: 42,
					}),
				],
			})

		expect(createStore).toThrow()
	})

	it('should throw if asNumber is not a boolean', () => {
		const createStore = () =>
			init<Models, ExtraModels>({
				models: { count },
				plugins: [
					// @ts-expect-error
					loadingPlugin({
						// @ts-expect-error
						asNumber: 'should throw',
					}),
				],
			})

		expect(createStore).toThrow()
	})

	test('should block items if not in whitelist', () => {
		const store = init<Models, ExtraModels>({
			models: { count },
			plugins: [
				loadingPlugin({
					asNumber: true,
					whitelist: ['some/action'],
				}),
			],
		})

		store.dispatch.count.timeout()
		expect(store.getState().loading.models.count).toBe(0)
	})

	test('should block items if in blacklist', () => {
		const store = init<Models, ExtraModels>({
			models: { count },
			plugins: [
				loadingPlugin({
					asNumber: true,
					blacklist: ['count/timeout'],
				}),
			],
		})

		store.dispatch.count.timeout()
		expect(store.getState().loading.models.count).toBe(0)
	})

	test('should throw if whitelist is not an array', () => {
		const createStore = () =>
			init<Models, ExtraModels>({
				models: { count },
				plugins: [
					// @ts-expect-error
					loadingPlugin({
						asNumber: true,
						// @ts-expect-error
						whitelist: 'some/action',
					}),
				],
			})

		expect(createStore).toThrow()
	})

	test('should throw if blacklist is not an array', () => {
		const createStore = () =>
			init<Models, ExtraModels>({
				models: { count },
				plugins: [
					// @ts-expect-error
					loadingPlugin({
						asNumber: true,
						// @ts-expect-error
						blacklist: 'some/action',
					}),
				],
			})

		expect(createStore).toThrow()
	})

	test('should throw if contains both a whitelist & blacklist', () => {
		const createStore = () =>
			init<Models, ExtraModels>({
				models: { count },
				plugins: [
					loadingPlugin({
						asNumber: true,
						whitelist: ['some/action'],
						blacklist: ['some/action'],
					}),
				],
			})

		expect(createStore).toThrow()
	})

	test('should handle "hide" if effect throws', async () => {
		const count2 = {
			state: 0,
			effects: {
				throwError() {
					throw new Error('effect error')
				},
			},
			reducers: {},
		}
		type Models = { count: typeof count2 }
		type ExtraModels = ExtraModelsFromLoading<Models, { asNumber: true }>

		const store = init<Models, ExtraModels>({
			models: { count: count2 },
			plugins: [loadingPlugin({ asNumber: true })],
		})

		try {
			await store.dispatch.count.throwError()
		} catch (err) {
			expect(store.getState().loading.global).toBe(0)
		}
	})

	test('should trigger four actions', async () => {
		const actions: any[] = []
		const store = init<Models, ExtraModels>({
			models: { count },
			plugins: [loadingPlugin({ asNumber: true })],
			redux: {
				middlewares: [
					() => (next) => (action: any): any => {
						actions.push(action.type)
						return next(action)
					},
				],
			},
		})

		await store.dispatch.count.timeout()
		expect(actions).toEqual([
			'loading/show',
			'count/timeout',
			'count/addOne',
			'loading/hide',
		])
	})

	test('should allow the propagation of the error', async () => {
		const count2 = {
			state: 0,
			effects: {
				throwError() {
					throw new Error('effect error')
				},
			},
			reducers: {},
		}
		type Models = { count: typeof count2 }
		type ExtraModels = ExtraModelsFromLoading<Models, { asNumber: true }>

		const store = init<Models, ExtraModels>({
			models: { count: count2 },
			plugins: [loadingPlugin({ asNumber: true })],
		})

		try {
			await store.dispatch.count.throwError()
		} catch (err: any) {
			expect(err.message).toBe('effect error')
		}
	})

	test('should allow the propagation of the effect result', async () => {
		const count2 = {
			state: 0,
			effects: {
				doSomething(): string {
					return 'foo'
				},
			},
			reducers: {},
		}

		type Models = { count: typeof count2 }
		type ExtraModels = ExtraModelsFromLoading<Models, { asNumber: true }>

		const store = init<Models, ExtraModels>({
			models: { count: count2 },
			plugins: [loadingPlugin({ asNumber: true })],
		})

		const effectResult = await store.dispatch.count.doSomething()

		expect(effectResult).toEqual('foo')
	})

	test('should allow the propagation of the effect reject', async () => {
		const count2 = {
			state: 0,
			effects: {
				async doSomething() {
					// eslint-disable-next-line no-throw-literal
					throw 'foo'
				},
			},
			reducers: {},
		}
		type Models = { count: typeof count2 }
		type ExtraModels = ExtraModelsFromLoading<Models, { asNumber: true }>

		const store = init<Models, ExtraModels>({
			models: { count: count2 },
			plugins: [loadingPlugin({ asNumber: true })],
		})

		const promise = store.dispatch.count.doSomething()
		await expect(promise).rejects.toBe('foo')
	})
})
