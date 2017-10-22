import { model, init, dispatch, getStore } from '../src'

beforeEach(() => {
  jest.resetModules()
})

describe('subscriptions:', () => {
  test('should create a working subscription', () => {
    init()

    model({
      name: 'first',
      state: 0,
      reducers: {
        addOne: (state) => state + 1,
      },
      subscriptions: {
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

  test('should allow for multiple subscriptions with same name in different models', () => {
    init()

    model({
      name: 'a',
      state: 0,
      reducers: {
        addOne: (state) => state + 1,
      },
      subscriptions: {
        'b/addOne': () => dispatch.a.addOne(),
      }
    })

    model({
      name: 'b',
      state: 0,
      reducers: {
        addOne: (state) => state + 1,
      },
    })

    model({
      name: 'c',
      state: 0,
      reducers: {
        addOne: (state) => state + 1,
      },
      subscriptions: {
        'b/addOne': () => dispatch.c.addOne(),
      },
    })

    dispatch.b.addOne()

    expect(getStore().getState()).toEqual({
      a: 1, b: 1, c: 1,
    })
  })

  xdescribe('pattern matching', () => {
    test('should create working pattern matching subscription (*)', () => {
      init()

      model({
        name: 'first',
        state: 0,
        reducers: {
          addOne: (state) => state + 1,
        },
        subscriptions: {
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

    test('should create working pattern matching subscription (second/*)', () => {
      init()

      model({
        name: 'first',
        state: 0,
        reducers: {
          addOne: (state) => state + 1,
        },
        subscriptions: {
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

    test('should create working pattern matching subsription (*/addOne)', () => {
      init()

      model({
        name: 'first',
        state: 0,
        reducers: {
          addOne: (state) => state + 1,
        },
        subscriptions: {
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

    test('should create working pattern matching subscription (second/add*)', () => {
      init()

      model({
        name: 'first',
        state: 0,
        reducers: {
          addOne: (state) => state + 1,
        },
        subscriptions: {
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

  test('it should throw if a subscription matcher is invalid', () => {
    init()

    expect(() => model({
      name: 'first',
      state: 0,
      reducers: {
        addOne: (state) => state + 1,
      },
      subscriptions: {
        'Not/A/Valid/Matcher': () => dispatch.first.addOne(),
      }
    })).toThrow()
  })
})
