/* eslint-disable @typescript-eslint/ban-ts-ignore */
import mergeConfig from '../src/utils/mergeConfig'

describe('mergeConfig:', () => {
	describe('initialState', () => {
		test('it should a regular config', () => {
			const config = {
				name: 'test',
				redux: {
					initialState: {
						a: 1,
					},
				},
			}
			const result = mergeConfig(config)
			expect(result.redux.initialState).toEqual(config.redux.initialState)
		})
	})

	describe('plugins', () => {
		test('should work with no additional plugins configs', () => {
			const config = {
				name: 'test',
				plugins: [],
			}
			const result = mergeConfig(config)
			expect(result.plugins).toEqual([])
		})

		test('should add new config plugins to the plugin list', () => {
			const plugin2 = { init: () => ({ onModel: () => {} }) }
			const plugin1 = {
				config: { plugins: [plugin2] },
				init: () => ({ onModel: () => {} }),
			}
			const config = {
				name: 'test',
				plugins: [plugin1],
			}
			const result = mergeConfig(config)
			expect(result.plugins).toEqual([plugin1, plugin2])
		})
	})

	describe('reducers', () => {
		test('should handle no redux reducers', () => {
			const result = mergeConfig({ name: 'test', redux: { reducers: {} } })
			expect(result.redux.reducers).toEqual({})
		})
		test('should handle only config redux reducers', () => {
			const config = {
				name: 'test',
				redux: {
					reducers: {
						example: state => state,
					},
				},
			}
			const result = mergeConfig(config)
			expect(result.redux.reducers).toEqual(config.redux.reducers)
		})

		test('should handle only plugin redux reducers', () => {
			const reducer = state => state
			const plugin = {
				config: {
					redux: {
						reducers: {
							example: reducer,
						},
					},
				},
			}
			const config = {
				name: 'test',
				redux: {},
				plugins: [plugin],
			}
			const result = mergeConfig(config)
			expect(result.redux.reducers).toEqual({ example: reducer })
		})

		test('should merge config & plugin redux reducers', () => {
			const reducer1 = state => state
			const reducer2 = state => state
			const plugin = {
				config: {
					redux: {
						reducers: {
							example: reducer1,
						},
					},
				},
			}
			const config = {
				name: 'test',
				redux: {
					reducers: {
						sample: reducer2,
					},
				},
				plugins: [plugin],
			}
			const result = mergeConfig(config)
			expect(result.redux.reducers).toEqual({
				example: reducer1,
				sample: reducer2,
			})
		})

		test('should apply additional redux enhancers', () => {
			const plugin = {
				config: {
					redux: {
						enhancers: [3, 4],
					},
				},
			}
			const config = {
				name: 'test',
				redux: {
					enhancers: [1, 2],
				},
				plugins: [plugin],
			}
			// @ts-ignore
			const result = mergeConfig(config)
			expect(result.redux.enhancers).toEqual([1, 2, 3, 4])
		})

		test('config redux reducers should overwrite plugin reducers', () => {
			const reducer = state => state
			const config = {
				name: 'test',
				redux: {
					reducers: {
						example: reducer,
					},
				},
			}
			const result = mergeConfig(config)
			expect(result.redux.reducers).toEqual({
				example: reducer,
			})
		})
	})

	describe('redux', () => {
		test('should handle no redux combineReducers', () => {
			const result = mergeConfig({ name: 'test' })
			expect(result.redux.combineReducers).toEqual(undefined)
		})
		test('should handle config redux combineReducers', () => {
			const combineReducers = s => s + 1
			const config = {
				name: 'test',
				redux: {
					combineReducers,
				},
			}
			const result = mergeConfig(config)
			expect(result.redux.combineReducers).toEqual(combineReducers)
		})

		test('if both, plugin redux.combineReducers should take priority over config', () => {
			const pluginFn = s => s + 1
			const configFn = s => s * 5
			const plugin1 = {
				redux: {
					combineReducers: pluginFn,
				},
			}
			const config = {
				name: 'test',
				redux: {
					combineReducers: configFn,
				},
				plugins: [plugin1],
			}
			// @ts-ignore
			const result = mergeConfig(config)
			expect(result.redux.combineReducers).toBe(configFn)
		})
	})
})
