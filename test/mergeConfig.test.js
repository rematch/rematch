import mergeConfig from '../src/utils/mergeConfig'

// plugins?: $plugin[],
// extraReducers?: {
//  [reducerName: string]: (state: any, action: Object) => any,
// },
// rootReducerEnhancer?: (rootReducer: $reducer) => any,

describe('mergeConfig', () => {
  describe('initialState', () => {
    test('it should handle no secondary config', () => {
      const c1 = {
        initialState: {
          a: 1,
        },
      }
      const result = mergeConfig(c1)
      expect(result.initialState).toEqual(c1.initialState)
    })
    test('it should handle no primary config', () => {
      const c2 = {
        initialState: {
          a: 1,
        },
      }
      const result = mergeConfig(undefined, c2)
      expect(result.initialState).toEqual(c2.initialState)
    })
    test('a secondary config should merge initialState', () => {
      const c1 = {
        initialState: {
          a: 1,
        },
      }
      const c2 = {
        initialState: {
          b: 23,
        },
      }
      const result = mergeConfig(c1, c2)
      expect(result.initialState).toEqual({
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

  describe('extraReducers', () => {
    test('should handle no extra reducers', () => {
      const result = mergeConfig({}, {})
      expect(result.extraReducers).toEqual({})
    })
    test('should handle only c1 extra reducers', () => {
      const c1 = {
        extraReducers: {
          example: 1
        }
      }
      const result = mergeConfig(c1)
      expect(result.extraReducers).toEqual(c1.extraReducers)
    })

    test('should handle only c2 extra reducers', () => {
      const c2 = {
        extraReducers: {
          example: 1
        }
      }
      const result = mergeConfig(undefined, c2)
      expect(result.extraReducers).toEqual(c2.extraReducers)
    })

    test('should merge c1 & c2 extra reducers', () => {
      const c1 = {
        extraReducers: {
          example: 1
        }
      }
      const c2 = {
        extraReducers: {
          sample: 2
        }
      }
      const result = mergeConfig(c1, c2)
      expect(result.extraReducers).toEqual({
        example: 1,
        sample: 2,
      })
    })

    test('c2 extra reducers should overwrite c1', () => {
      const c1 = {
        extraReducers: {
          example: 1
        }
      }
      const c2 = {
        extraReducers: {
          example: 2
        }
      }
      const result = mergeConfig(c1, c2)
      expect(result.extraReducers).toEqual({
        example: 2,
      })
    })
  })

  describe('rootReducerEnhancer', () => {
    test('should handle no extra rootReducerEnhancer', () => {
      const result = mergeConfig({}, {})
      expect(result.extraReducers).toEqual({})
    })
    test('should handle only c1 rootReducerEnhancer', () => {
      const c1f = s => s + 1
      const c1 = {
        rootReducerEnhancer: c1f
      }
      const result = mergeConfig(c1)
      expect(result.rootReducerEnhancer).toEqual(c1f)
    })

    test('should handle only c2 rootReducerEnhancer', () => {
      const c2f = s => s + 2
      const c2 = {
        rootReducerEnhancer: c2f
      }
      const result = mergeConfig(undefined, c2)
      expect(result.rootReducerEnhancer).toEqual(c2f)
    })

    test('if both, c2 rootReducerEnhancer should wrap c1', () => {
      const c1f = s => s + 1
      const c2f = s => s * 5
      const c1 = {
        rootReducerEnhancer: c1f,
      }
      const c2 = {
        rootReducerEnhancer: c2f,
      }
      const result = mergeConfig(c1, c2)
      // (2 + 1) * 5
      expect(result.rootReducerEnhancer(2)).toBe(15)
    })
  })
})
