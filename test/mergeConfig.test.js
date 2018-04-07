const mergeConfig = require('../src/utils/mergeConfig').default

describe('mergeConfig:', () => {
  describe('initialState', () => {
    test('it should a regular config', () => {
      const config = {
        redux: {
          initialState: {
            a: 1,
          },
        }
      }
      const result = mergeConfig(config)
      expect(result.redux.initialState).toEqual(config.redux.initialState)
    })
  })

  describe('plugins', () => {
    test('should work with no additional plugins configs', () => {
      const config = {
        plugins: []
      }
      const result = mergeConfig(config)
      expect(result.plugins).toEqual([])
    })

    test('should add new config plugins to the plugin list', () => {
      const plugin2 = { init: () => ({ onModel: () => {} }) }
      const plugin1 = { config: { plugins: [plugin2] }, init: () => ({ onModel: () => {} }) }
      const config = {
        plugins: [plugin1]
      }
      const result = mergeConfig(config)
      expect(result.plugins).toEqual([plugin1, plugin2])
    })
  })

  describe('reducers', () => {
    test('should handle no redux reducers', () => {
      const result = mergeConfig({ redux: {}, reducers: {} })
      expect(result.redux.reducers).toEqual({})
    })
    test('should handle only config redux reducers', () => {
      const config = {
        redux: {
          reducers: {
            example: 1,
          },
        }
      }
      const result = mergeConfig(config)
      expect(result.redux.reducers).toEqual(config.redux.reducers)
    })

    test('should handle only plugin redux reducers', () => {
      const plugin = {
        config: {
          redux: {
            reducers: {
              example: 1
            }
          }
        }
      }
      const config = {
        redux: {},
        plugins: [plugin]
      }
      const result = mergeConfig(config)
      expect(result.redux.reducers).toEqual({ example: 1 })
    })

    test('should merge config & plugin redux reducers', () => {
      const plugin = {
        config: {
          redux: {
            reducers: {
              example: 1
            }
          }
        }
      }
      const config = {
        redux: {
          reducers: {
            sample: 2
          }
        },
        plugins: [plugin]
      }
      const result = mergeConfig(config)
      expect(result.redux.reducers).toEqual({
        example: 1,
        sample: 2,
      })
    })

    test('should apply additional redux enhancers', () => {
      const plugin = {
        config: {
          redux: {
            enhancers: [3, 4]
          }
        }
      }
      const config = {
        redux: {
          enhancers: [1, 2]
        },
        plugins: [plugin]
      }
      const result = mergeConfig(config)
      expect(result.redux.enhancers).toEqual([1, 2, 3, 4])
    })

    test('config redux reducers should overwrite plugin reducers', () => {
      const plugin = {
        redux: {
          reducers: {
            example: 1
          }
        }
      }
      const config = {
        redux: {
          reducers: {
            example: 2
          }
        }
      }
      const result = mergeConfig(config)
      expect(result.redux.reducers).toEqual({
        example: 2,
      })
    })
  })

  describe('redux', () => {
    test('should handle no redux combineReducers', () => {
      const result = mergeConfig({})
      expect(result.redux.combinedReducers).toEqual(undefined)
    })
    test('should handle config redux combineReducers', () => {
      const combineReducers = s => s + 1
      const config = {
        redux: {
          combineReducers,
        }
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
        }
      }
      const config = {
        redux: {
          combineReducers: configFn,
        },
        plugins: [plugin1]
      }
      const result = mergeConfig(config)
      expect(result.redux.combineReducers).toBe(configFn)
    })
  })
})
