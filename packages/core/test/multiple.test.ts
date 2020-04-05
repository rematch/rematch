/* eslint-disable @typescript-eslint/ban-ts-ignore */
import { init } from '../src'

describe('multiple stores:', () => {
	afterEach(() => {
		jest.resetModules()
	})

	test('should not throw if multiple stores', () => {
		init({})
		expect(() => init({})).not.toThrow()
	})

	test('should store state for multiple stores', () => {
		const store1 = init({ models: { count1: { state: 0, reducers: {} } } })
		const store2 = init({ models: { count2: { state: 42, reducers: {} } } })

		expect(store1.getState()).toEqual({ count1: 0 })
		expect(store2.getState()).toEqual({ count2: 42 })
	})

	test('should be able to store.dispatch to specific stores', () => {
		const count = {
			state: 0,
			reducers: {
				increment: (state: number): number => state + 1,
			},
		}

		const store1 = init({ models: { count } })
		const store2 = init({ models: { count } })

		store1.dispatch.count.increment()

		store2.dispatch.count.increment()
		store2.dispatch.count.increment()

		expect(store1.getState()).toEqual({ count: 1 })
		expect(store2.getState()).toEqual({ count: 2 })
	})

	test('dispatch should not overwrite another dispatch', () => {
		const count1 = {
			state: 0,
			reducers: {
				increment: (state: number): number => state + 1,
			},
		}

		const count2 = {
			state: 0,
			reducers: {
				increment: (state: number): number => state + 2,
			},
		}

		const store1 = init({ models: { count: count1 } })
		const store2 = init({ models: { count: count2 } })

		store1.dispatch({ type: 'count/increment' })
		store2.dispatch({ type: 'count/increment' })

		expect(store1.getState()).toEqual({ count: 1 })
		expect(store2.getState()).toEqual({ count: 2 })
	})

	test('dispatch should not contain another stores reducers', () => {
		const count1 = {
			state: 0,
			reducers: {
				increment: (state: number): number => state + 1,
			},
		}

		const count2 = {
			state: 0,
			reducers: {
				add: (state: number): number => state + 2,
			},
		}

		const store1 = init({ models: { count: count1 } })
		const store2 = init({ models: { count: count2 } })

		expect(store1.dispatch.count.increment).toBeDefined()
		// we need to ignore to test that it doesn't exist
		// @ts-ignore
		expect(store2.dispatch.count.increment).not.toBeDefined()
		// we need to ignore to test that it doesn't exist
		// @ts-ignore
		expect(store1.dispatch.count.add).not.toBeDefined()
		expect(store2.dispatch.count.add).toBeDefined()
	})

	test('dispatch should not contain another stores effects', () => {
		const say = {
			state: 0,
			effects: {
				async hi(): Promise<void> {
					// void
				},
			},
			reducers: {},
		}

		const speak = {
			state: 0,
			effects: {
				async hi(): Promise<void> {
					// void
				},
			},
			reducers: {},
		}

		const store1 = init({ models: { say } })
		const store2 = init({ models: { speak } })

		expect(store1.dispatch.say.hi).toBeDefined()
		// we need to ignore to test that it doesn't exist
		// @ts-ignore
		expect(store2.dispatch.say).not.toBeDefined()
		// we need to ignore to test that it doesn't exist
		// @ts-ignore
		expect(store1.dispatch.speak).not.toBeDefined()
		expect(store2.dispatch.speak.hi).toBeDefined()
	})

	test('dispatch should not overwrite another effect', async () => {
		const calls: string[] = []

		const count1 = {
			state: 0,
			effects: {
				async asyncIncrement(): Promise<void> {
					await calls.push('count1')
				},
			},
			reducers: {},
		}

		const count2 = {
			state: 0,
			effects: {
				async asyncIncrement(): Promise<void> {
					await calls.push('count2')
				},
			},
			reducers: {},
		}

		const store1 = init({ models: { count: count1 } })
		const store2 = init({ models: { count: count2 } })

		await store1.dispatch.count.asyncIncrement().result
		await store2.dispatch.count.asyncIncrement().result

		expect(calls).toEqual(['count1', 'count2'])
	})
})
