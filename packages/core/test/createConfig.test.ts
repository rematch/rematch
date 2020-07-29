import createConfig from '../src/config'

describe('createConfig:', () => {
	describe('empty', () => {
		test('should create config from empty initial config', () => {
			const result = createConfig({})
			expect(result.name).toBeDefined()
		})
	})

	describe('initialState', () => {
		test('should create config with initial state', () => {
			const config = {
				redux: {
					initialState: {
						a: 1,
					},
				},
			}

			const result = createConfig(config)
			expect(result.redux.initialState).toEqual(config.redux.initialState)
		})
	})

	describe('plugins', () => {
		test('should work with no additional plugins configs', () => {
			const config = {
				plugins: [],
			}

			const result = createConfig(config)
			expect(result.plugins).toEqual([])
		})
	})

	describe('reducers', () => {
		test('should handle no redux reducers', () => {
			const result = createConfig({ redux: { reducers: {} } })
			expect(result.redux.reducers).toEqual({})
		})

		test('should handle only config redux reducers', () => {
			const config = {
				redux: {
					reducers: {
						example: (state: any): any => state,
					},
				},
			}

			const result = createConfig(config)
			expect(result.redux.reducers).toEqual(config.redux.reducers)
		})

		test('should handle only plugin redux reducers', () => {
			const reducer = (state: any): any => state
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
				redux: {},
				plugins: [plugin],
			}

			const result = createConfig(config)
			expect(result.redux.reducers).toEqual({ example: reducer })
		})

		test('should merge config & plugin redux reducers', () => {
			const reducer1 = (state: any): any => state
			const reducer2 = (state: any): any => state
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
				redux: {
					reducers: {
						sample: reducer2,
					},
				},
				plugins: [plugin],
			}

			const result = createConfig(config)
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
				redux: {
					enhancers: [1, 2],
				},
				plugins: [plugin],
			} as any

			const result = createConfig(config)
			expect(result.redux.enhancers).toEqual([1, 2, 3, 4])
		})

		test('config redux reducers should overwrite plugin reducers', () => {
			const reducer = (state: any): any => state
			const config = {
				redux: {
					reducers: {
						example: reducer,
					},
				},
			}

			const result = createConfig(config)
			expect(result.redux.reducers).toEqual({
				example: reducer,
			})
		})
	})

	describe('redux', () => {
		test('should handle no redux combineReducers', () => {
			const result = createConfig({})
			expect(result.redux.combineReducers).toEqual(undefined)
		})

		test('should handle config redux combineReducers', () => {
			const combineReducers = (s: any): any => s + 1
			const config = {
				redux: {
					combineReducers,
				},
			}

			const result = createConfig(config)
			expect(result.redux.combineReducers).toEqual(combineReducers)
		})

		test('if both, plugin redux.combineReducers should take priority over config', () => {
			const pluginFn = (s: any): any => s + 1
			const configFn = (s: any): any => s * 5
			const plugin1 = {
				redux: {
					combineReducers: pluginFn,
				},
			}
			const config = {
				redux: {
					combineReducers: configFn,
				},
				plugins: [plugin1],
			} as any

			const result = createConfig(config)
			expect(result.redux.combineReducers).toBe(configFn)
		})
	})
})
