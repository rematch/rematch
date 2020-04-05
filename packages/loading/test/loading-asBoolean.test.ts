import { EffectAction, init } from '@rematch/core'
import loadingPlugin from '../src'
import { delay, count } from './utils'

describe('loading asBoolean', () => {
	test('loading.global should be 0 for normal dispatched action', () => {
		const store = init({
			models: { count },
			plugins: [loadingPlugin()],
		})

		store.dispatch.count.addOne()
		expect(store.getState().loading.global).toBe(false)
	})

	test('loading.global should be 1 for a dispatched effect', () => {
		const store = init({
			models: { count },
			plugins: [loadingPlugin()],
		})

		store.dispatch.count.timeout()
		expect(store.getState().loading.global).toBe(true)
	})

	test('loading.global should be 2 for two dispatched effects', () => {
		const store = init({
			models: { count },
			plugins: [loadingPlugin()],
		})

		store.dispatch.count.timeout()
		store.dispatch.count.timeout()
		expect(store.getState().loading.global).toBe(true)
	})

	test('should set loading.models[name] to false', () => {
		const store = init({
			models: { count },
			plugins: [loadingPlugin()],
		})

		expect(store.getState().loading.models.count).toBe(false)
	})

	test('should change the loading.models to true', () => {
		const store = init({
			models: { count },
			plugins: [loadingPlugin()],
		})

		store.dispatch.count.timeout()
		expect(store.getState().loading.models.count).toBe(true)
	})

	test('should change the loading.models to true (double dispatch)', () => {
		const store = init({
			models: { count },
			plugins: [loadingPlugin()],
		})

		store.dispatch.count.timeout()
		store.dispatch.count.timeout()
		expect(store.getState().loading.models.count).toBe(true)
	})

	test('should set loading.effects[name] to object of effects', () => {
		const store = init({
			models: { count },
			plugins: [loadingPlugin()],
		})
		expect(store.getState().loading.effects.count.timeout).toBe(false)
	})

	test('should change the loading.effects to true', () => {
		const store = init({
			models: { count },
			plugins: [loadingPlugin()],
		})

		store.dispatch.count.timeout()
		expect(store.getState().loading.effects.count.timeout).toBe(true)
	})

	test('should change the loading.effects to true (double dispatch)', () => {
		const store = init({
			models: { count },
			plugins: [loadingPlugin()],
		})

		store.dispatch.count.timeout()
		store.dispatch.count.timeout()
		expect(store.getState().loading.effects.count.timeout).toBe(true)
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

		const store = init({
			models: { count: count2 },
			plugins: [loadingPlugin()],
		})

		const effect1 = store.dispatch.count.timeout1()
		await delay(100)
		const effect2 = store.dispatch.count.timeout2()

		const ld = (): any => store.getState().loading
		expect(ld().effects.count.timeout1).toBe(true)
		expect(ld().effects.count.timeout2).toBe(true)
		expect(ld().models.count).toBe(true)
		expect(ld().global).toBe(true)

		await (effect1 as EffectAction).result
		expect(ld().effects.count.timeout1).toBe(false)
		expect(ld().effects.count.timeout2).toBe(true)
		expect(ld().models.count).toBe(true)
		expect(ld().global).toBe(true)

		await (effect2 as EffectAction).result
		expect(ld().effects.count.timeout1).toBe(false)
		expect(ld().effects.count.timeout2).toBe(false)
		expect(ld().models.count).toBe(false)
		expect(ld().global).toBe(false)
	})

	test('should configure the loading name to "foobar"', () => {
		const store = init({
			models: { count },
			plugins: [loadingPlugin({ name: 'foobar' })],
		})

		store.dispatch.count.addOne()
		expect(store.getState().foobar.global).toBe(false)
	})

	test('should throw if loading name is not a string', () => {
		const createStore = () =>
			init({
				models: { count },
				// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
				// @ts-ignore
				plugins: [loadingPlugin({ name: 42 })],
			})

		expect(createStore).toThrow()
	})

	test('should block items if not in whitelist', () => {
		const store = init({
			models: { count },
			plugins: [
				loadingPlugin({
					whitelist: ['some/action'],
				}),
			],
		})

		store.dispatch.count.timeout()
		expect(store.getState().loading.models.count).toBe(false)
	})

	test('should block items if in blacklist', () => {
		const store = init({
			models: { count },
			plugins: [
				loadingPlugin({
					blacklist: ['count/timeout'],
				}),
			],
		})

		store.dispatch.count.timeout()
		expect(store.getState().loading.models.count).toBe(false)
	})

	test('should throw if whitelist is not an array', () => {
		const createStore = () =>
			init({
				models: { count },
				plugins: [
					// @ts-ignore
					loadingPlugin({
						// @ts-ignore
						whitelist: 'some/action',
					}),
				],
			})

		expect(createStore).toThrow()
	})

	test('should throw if blacklist is not an array', () => {
		const createStore = () =>
			init({
				models: { count },
				plugins: [
					// @ts-ignore
					loadingPlugin({
						// @ts-ignore
						blacklist: 'some/action',
					}),
				],
			})

		expect(createStore).toThrow()
	})

	test('should throw if contains both a whitelist & blacklist', () => {
		const createStore = () =>
			init({
				models: { count },
				plugins: [
					loadingPlugin({
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
				throwError(): void {
					throw new Error('effect error')
				},
			},
			reducers: {},
		}
		const store = init({
			models: { count: count2 },
			plugins: [loadingPlugin()],
		})

		try {
			await store.dispatch.count.throwError()
		} catch (err) {
			expect(store.getState().loading.global).toBe(false)
		}
	})

	test('should trigger four actions', async () => {
		const actions: any[] = []
		const store = init({
			models: { count },
			plugins: [loadingPlugin()],
			redux: {
				middlewares: [
					() => (next: any) => (action: any): any => {
						actions.push(action.type)
						return next(action)
					},
				],
			},
		})

		await (store.dispatch.count.timeout() as EffectAction).result
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
				throwError(): void {
					throw new Error('effect error')
				},
			},
			reducers: {},
		}

		const store = init({
			models: { count: count2 },
			plugins: [loadingPlugin()],
		})

		try {
			await (store.dispatch.count.throwError() as EffectAction).result
		} catch (err) {
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

		const store = init({
			models: { count: count2 },
			plugins: [loadingPlugin()],
		})

		const effectResult = await (store.dispatch.count.doSomething() as EffectAction)
			.result

		expect(effectResult).toEqual('foo')
	})

	test('should allow the propagation of the effect reject', async () => {
		const count2 = {
			state: 0,
			effects: {
				async doSomething(): Promise<void> {
					// eslint-disable-next-line no-throw-literal
					throw 'foo'
				},
			},
			reducers: {},
		}

		const store = init({
			models: { count: count2 },
			plugins: [loadingPlugin()],
		})

		const promise = (store.dispatch.count.doSomething() as EffectAction).result
		await expect(promise).rejects.toBe('foo')
	})
})
