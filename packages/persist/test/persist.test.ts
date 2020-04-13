/* eslint-disable no-underscore-dangle */
import { init } from '@rematch/core'
import { createAsyncStorageMock } from './localStorage.mock'
import persistPlugin, { getPersistor } from '../src'

beforeEach(() => {
	jest.resetModules()
})

const defaultPersist = {
	rehydrated: false,
	version: -1,
}

describe('persist', () => {
	test('should load the persist plugin with a basic config', () => {
		const store = init({
			plugins: [
				persistPlugin({ key: 'root', storage: createAsyncStorageMock() }),
			],
			redux: {
				initialState: {},
			},
		})

		expect(store.getState()._persist).toEqual(defaultPersist)
	})

	test('should load the persist plugin with a config', () => {
		const plugin = persistPlugin({
			key: 'test',
			version: 2,
			storage: createAsyncStorageMock(),
		})

		const store = init({
			plugins: [plugin],
		})

		expect(store.getState()._persist).toEqual({
			...defaultPersist,
			version: 2,
		})
	})

	test('should create a persistor', () => {
		init({
			plugins: [
				persistPlugin({
					key: 'root',
					storage: createAsyncStorageMock(),
				}),
			],
			redux: {
				initialState: {},
			},
		})

		const persistor = getPersistor()

		expect(persistor.purge).toBeDefined()
	})

	test('should work with init models', () => {
		const a = {
			name: 'a',
			state: { b: 1 },
			reducers: {
				addOne: (s: any): any => ({ b: s.b + 1 }),
			},
		}

		const store = init({
			models: { a },
			plugins: [
				persistPlugin({ key: 'root', storage: createAsyncStorageMock() }),
			],
		})

		store.dispatch.a.addOne()

		const persistor = getPersistor()
		expect(persistor.purge).toBeDefined()
		// @ts-ignore
		expect(store.getState()._persist).toEqual(defaultPersist)
		expect(store.getState().a).toEqual({ b: 2 })
	})

	test('should allow resetting state', () => {
		const count = {
			state: 0,
			reducers: {
				addOne(state: number): number {
					return state + 1
				},
			},
		}

		const store = init({
			models: { count },
			plugins: [
				persistPlugin({ key: 'root', storage: createAsyncStorageMock() }),
			],
			redux: {
				rootReducers: {
					PURGE: (): undefined => {
						return undefined
					},
				},
			},
		})

		store.dispatch.count.addOne()
		store.dispatch.count.addOne()
		store.dispatch({ type: 'PURGE' })

		getPersistor().purge()
		expect(store.getState().count).toBe(0)
	})
})
