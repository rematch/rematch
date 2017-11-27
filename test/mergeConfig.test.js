const mergeConfig = require('../lib/utils/mergeConfig').default

describe('mergeConfig', () => {
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
    test('should work with no additional c2 plugins', () => {
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

    // test('should not add new plugins if they already exist', () => {
    //   const plugin1 = { init: () => ({ onModel: () => {} }) }
    //   const config = {
    //     plugins: [plugin1, plugin1]
    //   }
    //   const result = mergeConfig(config)
    //   expect(result.plugins).toEqual([plugin1])
    // })
  })

  describe('reducers', () => {
    test('should handle no redux reducers', () => {
      const result = mergeConfig({ redux: {}, reducers: {} })
      expect(result.redux.reducers).toBe(undefined)
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

  describe('overwrites', () => {
    test('should handle no redux combineReducers', () => {
      const result = mergeConfig({})
      expect(result.redux).toBe(undefined)
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

    test('if both, plugin overwrites redux.combineReducers should take priority over config', () => {
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
      // (2 + 1) * 5
      expect(result.redux.combineReducers).toBe(configFn)
    })
  })
})
