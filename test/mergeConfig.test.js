import { mergeConfig } from '../src/utils/mergeConfig'

describe('mergeConfig', () => {
  describe('initialState', () => {
    test('it should handle no secondary config', () => {
      const c1 = {
        redux: {
          initialState: {
            a: 1,
          },
        }
      }
      const result = mergeConfig(c1)
      expect(result.redux.initialState).toEqual(c1.redux.initialState)
    })
    test('it should handle no primary config', () => {
      const c2 = {
        redux: {
          initialState: {
            a: 1,
          },
        }
      }
      const result = mergeConfig({}, c2)
      expect(result.redux.initialState).toEqual(c2.redux.initialState)
    })
    test('a secondary config should merge initialState', () => {
      const c1 = {
        redux: {
          initialState: {
            a: 1,
          },
        }
      }
      const c2 = {
        redux: {
          initialState: {
            b: 23,
          },
        }
      }
      const result = mergeConfig(c1, c2)
      expect(result.redux.initialState).toEqual({
        a: 1,
        b: 23
      })
    })
  })

  describe('plugins', () => {
    test('should work with no additional c2 plugins', () => {
      const c1 = {
        plugins: []
      }
      const result = mergeConfig(c1, {})
      expect(result.plugins).toEqual([])
    })

    test('should add new c2 plugins to the plugin list', () => {
      const plugin1 = { init: () => ({ onModel: () => {} }) }
      const c1 = {
        plugins: []
      }
      const c2 = {
        plugins: [plugin1]
      }
      const result = mergeConfig(c1, c2)
      expect(result.plugins).toEqual([plugin1])
    })

    test('should not add new plugins if they already exist', () => {
      const plugin1 = { init: () => ({ onModel: () => {} }) }
      const c1 = {
        plugins: [plugin1]
      }
      const c2 = {
        plugins: [plugin1]
      }
      const result = mergeConfig(c1, c2)
      expect(result.plugins).toEqual([plugin1])
    })
  })

  describe('reducers', () => {
    test('should handle no redux reducers', () => {
      const result = mergeConfig({}, {})
      expect(result.redux.reducers).toEqual({})
    })
    test('should handle only c1 redux reducers', () => {
      const c1 = {
        redux: {
          reducers: {
            example: 1,
          },
        }
      }
      const result = mergeConfig(c1)
      expect(result.redux.reducers).toEqual(c1.redux.reducers)
    })

    test('should handle only c2 redux reducers', () => {
      const c2 = {
        redux: {
          reducers: {
            example: 1
          }
        }
      }
      const result = mergeConfig({}, c2)
      expect(result.redux.reducers).toEqual(c2.redux.reducers)
    })

    test('should merge c1 & c2 redux reducers', () => {
      const c1 = {
        redux: {
          reducers: {
            example: 1
          }
        }
      }
      const c2 = {
        redux: {
          reducers: {
            sample: 2
          }
        }
      }
      const result = mergeConfig(c1, c2)
      expect(result.redux.reducers).toEqual({
        example: 1,
        sample: 2,
      })
    })

    test('c2 redux reducers should overwrite c1', () => {
      const c1 = {
        redux: {
          reducers: {
            example: 1
          }
        }
      }
      const c2 = {
        redux: {
          reducers: {
            example: 2
          }
        }
      }
      const result = mergeConfig(c1, c2)
      expect(result.redux.reducers).toEqual({
        example: 2,
      })
    })
  })

  describe('ovewrites', () => {
    test('should handle no ovewrites.combineReducers', () => {
      const result = mergeConfig({}, {})
      expect(result.redux.reducers).toEqual({})
    })
    test('should handle only c1 overwrites.combineReducers', () => {
      const c1f = s => s + 1
      const c1 = {
        redux: {
          combineReducers: c1f,
        }
      }
      const result = mergeConfig(c1)
      expect(result.redux.combineReducers).toEqual(c1f)
    })

    test('should handle only c2 overwrites.combineReducers', () => {
      const c2f = s => s + 2
      const c2 = {
        redux: {
          combineReducers: c2f,
        }
      }
      const result = mergeConfig({ redux: {} }, c2)
      expect(result.redux.combineReducers).toEqual(c2f)
    })

    test('if both, c2 overwrites.combineReducers should take priority over c1', () => {
      const c1f = s => s + 1
      const c2f = s => s * 5
      const c1 = {
        redux: {
          combineReducers: c1f,
        }
      }
      const c2 = {
        redux: {
          combineReducers: c2f,
        }
      }
      const result = mergeConfig(c1, c2)
      // (2 + 1) * 5
      expect(result.redux.combineReducers).toBe(c2f)
    })
  })
})
