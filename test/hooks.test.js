import { model, init, dispatch, getStore } from '../src'

beforeEach(() => {
  jest.resetModules()
})

describe('hooks:', () => {
  test('should create a working hook', () => {
    init()

    model({
      name: 'first',
      state: 0,
      reducers: {
        addOne: (state) => state + 1,
      },
      hooks: {
        'second/addOne': () => dispatch.first.addOne(),
      }
    })

    model({
      name: 'second',
      state: 0,
      reducers: {
        addOne: (state) => state + 1,
      },
    })

    dispatch.second.addOne()

    expect(getStore().getState()).toEqual({
      second: 1, first: 1,
    })
  })

  xdescribe('pattern matching', () => {
    test('should create working pattern matching hook (*)', () => {
      init()

      model({
        name: 'first',
        state: 0,
        reducers: {
          addOne: (state) => state + 1,
        },
        hooks: {
          '*': () => dispatch.first.addOne(),
        }
      })

      model({
        name: 'second',
        state: 0,
        reducers: {
          addOne: (state) => state + 1,
        },
      })

      dispatch.second.addOne()

      expect(getStore().getState()).toEqual({
        second: 1, first: 1,
      })
    })

    test('should create working pattern matching hook (second/*)', () => {
      init()

      model({
        name: 'first',
        state: 0,
        reducers: {
          addOne: (state) => state + 1,
        },
        hooks: {
          'second/*': () => dispatch.first.addOne(),
        }
      })

      model({
        name: 'second',
        state: 0,
        reducers: {
          addOne: (state) => state + 1,
        },
      })

      dispatch.second.addOne()

      expect(getStore().getState()).toEqual({
        second: 1, first: 1,
      })
    })

    test('should create working pattern matching hook (*/addOne)', () => {
      init()

      model({
        name: 'first',
        state: 0,
        reducers: {
          addOne: (state) => state + 1,
        },
        hooks: {
          '*/addOne': () => dispatch.first.addOne(),
        }
      })

      model({
        name: 'second',
        state: 0,
        reducers: {
          addOne: (state) => state + 1,
        },
      })

      dispatch.second.addOne()

      expect(getStore().getState()).toEqual({
        second: 1, first: 1,
      })
    })

    test('should create working pattern matching hook (second/add*)', () => {
      init()

      model({
        name: 'first',
        state: 0,
        reducers: {
          addOne: (state) => state + 1,
        },
        hooks: {
          'second/add*': () => dispatch.first.addOne(),
        }
      })

      model({
        name: 'second',
        state: 0,
        reducers: {
          addOne: (state) => state + 1,
        },
      })

      dispatch.second.addOne()

      expect(getStore().getState()).toEqual({
        second: 1, first: 1,
      })
    })
  })

  test('it should throw if a hook matcher is invalid', () => {
    init()

    expect(() => model({
      name: 'first',
      state: 0,
      reducers: {
        addOne: (state) => state + 1,
      },
      hooks: {
        'Not/A/Valid/Matcher': () => dispatch.first.addOne(),
      }
    })).toThrow()
  })
})
