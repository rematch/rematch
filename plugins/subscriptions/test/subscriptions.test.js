beforeEach(() => {
  jest.resetModules()
})

const common = {
  state: 0,
  reducers: {
    addOne: (state) => state + 1,
  },
}

describe('subscriptions:', () => {
  test('should create a working subscription', () => {
    const {
      init, dispatch, getStore
    } = require('../../../src')
    const subscriptionsPlugin = require('../src').default
    const first = {
      ...common,
      subscriptions: {
        'second/addOne': () => dispatch.first.addOne(),
      }
    }
    const second = common
    init({
      models: { first, second },
      plugins: [subscriptionsPlugin()]
    })

    dispatch.second.addOne()

    expect(getStore().getState()).toEqual({
      second: 1, first: 1,
    })
  })

  test('should allow for two subscriptions with same name in different models', () => {
    const {
      init, dispatch, getStore
    } = require('../../../src')
    const subscriptionsPlugin = require('../src').default
    const a1 = {
      ...common,
      subscriptions: {
        'b1/addOne': () => dispatch.a1.addOne(),
      }
    }
    const b1 = common
    const c1 = {
      ...common,
      subscriptions: {
        'b1/addOne': () => dispatch.c1.addOne(),
      },
    }
    init({
      models: { a1, b1, c1 },
      plugins: [subscriptionsPlugin()]
    })

    dispatch.b1.addOne()

    expect(getStore().getState()).toEqual({
      a1: 1, b1: 1, c1: 1,
    })
  })

  test('should allow for three subscriptions with same name in different models', () => {
    const {
      init, dispatch, getStore
    } = require('../../../src')
    const subscriptionsPlugin = require('../src').default
    const a = {
      ...common,
      subscriptions: {
        'b/addOne': () => dispatch.a.addOne(),
      }
    }
    const b = common
    const c = {
      ...common,
      subscriptions: {
        'b/addOne': () => dispatch.c.addOne(),
      },
    }
    const d = {
      ...common,
      subscriptions: {
        'b/addOne': () => dispatch.d.addOne(),
      },
    }
    // no subscriptions, superfluous model
    // just an additional check to see that
    // other models are not effected
    const e = common
    init({
      models: {
        a, b, c, d, e
      },
      plugins: [subscriptionsPlugin()]
    })

    dispatch.b.addOne()

    expect(getStore().getState()).toEqual({
      a: 1, b: 1, c: 1, d: 1, e: 0
    })
  })

  test('should throw if a subscription matcher is invalid', () => {
    const { model, init, dispatch } = require('../../../src')
    const subscriptionsPlugin = require('../src').default
    init({
      plugins: [subscriptionsPlugin()]
    })

    expect(() => model({
      name: 'first',
      ...common,
      subscriptions: {
        'Not/A/Valid/Matcher': () => dispatch.first.addOne(),
      }
    })).toThrow()
  })

  test('should enforce subscriptions are functions', () => {
    const { model, init } = require('../../../src')
    const subscriptionsPlugin = require('../src').default
    init({
      plugins: [subscriptionsPlugin()]
    })

    expect(() => model({
      name: 'first',
      ...common,
      subscriptions: {
        'valid/matcher': 42,
      }
    })).toThrow()
  })

  describe('pattern matching', () => {
    test('should create working pattern matching subscription (second/*)', () => {
      const {
        init, dispatch, getStore
      } = require('../../../src')
      const subscriptionsPlugin = require('../src').default

      const first = {
        ...common,
        subscriptions: {
          'second/*': () => dispatch.first.addOne(),
        }
      }
      const second = common
      init({
        models: { first, second },
        plugins: [subscriptionsPlugin()]
      })

      dispatch.second.addOne()

      expect(getStore().getState()).toEqual({
        second: 1, first: 1,
      })
    })

    test('should create working pattern matching subsription (*/addOne)', () => {
      const {
        init, dispatch, getStore
      } = require('../../../src')
      const subscriptionsPlugin = require('../src').default
      
      const first = {
        ...common,
        subscriptions: {
          '*/add': () => dispatch.first.addOne(),
        }
      }
      const second = {
        state: 0,
        reducers: {
          add: (state, payload) => state + payload
        }
      }
      init({
        models: { first, second },
        plugins: [subscriptionsPlugin()]
      })

      dispatch.second.add(2)

      expect(getStore().getState()).toEqual({
        second: 2, first: 1,
      })
    })

    test('should create working pattern matching subscription (second/add*)', () => {
      const {
        init, dispatch, getStore
      } = require('../../../src')
      const subscriptionsPlugin = require('../src').default
      const first = {
        ...common,
        subscriptions: {
          'second/add*': () => dispatch.first.addOne(),
        }
      }
      const second = common
      init({
        models: { first, second },
        plugins: [subscriptionsPlugin()]
      })

      dispatch.second.addOne()

      expect(getStore().getState()).toEqual({
        second: 1, first: 1,
      })
    })

    test('should throw an error if a user creates a subscription that matches a reducer in the model', () => {
      const { model, init } = require('../../../src')
      const subscriptionsPlugin = require('../src').default
      init({
        plugins: [subscriptionsPlugin()]
      })

      const createModel = () => model({
        name: 'first',
        state: 0,
        reducers: {
          addOne: (state) => state + 1
        },
        subscriptions: {
          'first/addOne': () => console.log('anything'),
        }
      })

      expect(createModel).toThrow()
    })

    test('should throw an error if a user creates a subscription that matches an effect in the model', () => {
      const { model, init } = require('../../../src')
      const subscriptionsPlugin = require('../src').default
      init({
        plugins: [subscriptionsPlugin()]
      })

      const createModel = () => model({
        name: 'first',
        state: 0,
        effects: {
          sayHi: () => console.log('hi')
        },
        subscriptions: {
          'first/sayHi': () => console.log('anything'),
        }
      })

      expect(createModel).toThrow()
    })

    test('should throw an error if a user creates a subscription that pattern matches a reducer in the model', () => {
      const { model, init } = require('../../../src')
      const subscriptionsPlugin = require('../src').default
      init({
        plugins: [subscriptionsPlugin()]
      })

      const createModel = () => model({
        name: 'first',
        state: 0,
        reducers: {
          addOne: (state) => state + 1
        },
        subscriptions: {
          '*/addOne': () => console.log('anything'),
        }
      })

      expect(createModel).toThrow()
    })
  })

  test('should have access to state from second param', () => {
    const {
      init, dispatch, getStore
    } = require('../../../src')
    const subscriptionsPlugin = require('../src').default
    const first = {
      state: 3,
      reducers: {
        addBy: (state, payload) => state + payload
      },
      subscriptions: {
        'second/addOne': (action, state) => {
          dispatch.first.addBy(state.first)
        },
      }
    }
    const second = {
      ...common,
    }
    init({
      models: { first, second },
      plugins: [subscriptionsPlugin()]
    })

    dispatch.second.addOne()

    expect(getStore().getState()).toEqual({
      second: 1, first: 6,
    })
  })

  describe('unsubscribe:', () => {
    test('a matched action', () => {
      const {
        init, dispatch, getStore
      } = require('../../../src')
      const subscriptionsPlugin = require('../src').default
      const { createUnsubscribe } = require('../src/unsubscribe')
      const first = {
        ...common,
        subscriptions: {
          'second/addOne': () => dispatch.first.addOne(),
        }
      }
      const second = {
        ...common,
      }
      init({
        models: { first, second },
        plugins: [subscriptionsPlugin()]
      })
      const unsubscribe = createUnsubscribe('first', 'second/addOne')
      unsubscribe()
      dispatch.second.addOne()

      expect(getStore().getState()).toEqual({
        second: 1, first: 0,
      })
    })
    test('a pattern matched action', () => {
      const {
        init, dispatch, getStore
      } = require('../../../src')
      const subscriptionsPlugin = require('../src').default
      const { createUnsubscribe } = require('../src/unsubscribe')
      const first = {
        ...common,
        subscriptions: {
          'second/*': () => dispatch.first.addOne(),
        }
      }
      const second = {
        ...common,
      }
      init({
        models: { first, second },
        plugins: [subscriptionsPlugin()]
      })

      const unsubscribe = createUnsubscribe('first', 'second/*')
      unsubscribe()
      dispatch.second.addOne()

      expect(getStore().getState()).toEqual({
        second: 1, first: 0,
      })
    })
    test('a pattern matched action when more than one', () => {
      const {
        init, dispatch, getStore
      } = require('../../../src')
      const subscriptionsPlugin = require('../src').default
      const { createUnsubscribe } = require('../src/unsubscribe')
      const first = {
        ...common,
        subscriptions: {
          'second/*': () => dispatch.first.addOne(),
        }
      }
      const second = {
        ...common,
      }
      const third = {
        ...common,
        subscriptions: {
          'second/*': () => dispatch.third.addOne(),
        }
      }
      init({
        models: { first, second, third },
        plugins: [subscriptionsPlugin()]
      })
      const unsubscribe = createUnsubscribe('first', 'second/*')
      unsubscribe()
      dispatch.second.addOne()

      expect(getStore().getState()).toEqual({
        first: 0, second: 1, third: 1
      })
    })
    test('should throw if invalid action', () => {
      const { init, dispatch } = require('../../../src')
      const subscriptionsPlugin = require('../src').default
      const { createUnsubscribe } = require('../src/unsubscribe')
      const first = {
        ...common,
        subscriptions: {
          'second/addOne': () => dispatch.first.addOne(),
        }
      }
      init({
        models: { first },
        plugins: [subscriptionsPlugin()]
      })

      const unsubscribe = createUnsubscribe('first', 'an/invalid/action')

      expect(unsubscribe).toThrow()
    })
    test('should do nothing if no action', () => {
      const {
        init, dispatch, getStore
      } = require('../../../src')
      const subscriptionsPlugin = require('../src').default
      const { createUnsubscribe } = require('../src/unsubscribe')
      const first = {
        ...common,
        subscriptions: {
          'second/addOne': () => dispatch.first.addOne(),
        }
      }
      const second = common
      init({
        models: { first, second },
        plugins: [subscriptionsPlugin()]
      })

      const unsubscribe = createUnsubscribe('first', 'not/existing')
      unsubscribe()
      dispatch.second.addOne()

      expect(getStore().getState()).toEqual({
        second: 1, first: 1,
      })
    })

    test('should allow unsubscribe within a model', () => {
      const {
        init, dispatch, getStore
      } = require('../../../src')
      const subscriptionsPlugin = require('../src').default
      const first = {
        ...common,
        subscriptions: {
          'second/addOne': (action, exposed, unsubscribe) => {
            dispatch.first.addOne()
            unsubscribe()
          },
        }
      }
      const second = common
      init({
        models: { first, second },
        plugins: [subscriptionsPlugin()]
      })

      dispatch.second.addOne()
      dispatch.second.addOne()
      dispatch.second.addOne()

      expect(getStore().getState()).toEqual({
        second: 3, first: 1,
      })
    })

    test('should allow unsubscribe within a model with a pattern match', () => {
      const {
        init, dispatch, getStore
      } = require('../../../src')
      const subscriptionsPlugin = require('../src').default
      const first = {
        ...common,
        subscriptions: {
          'other/*': (action, exposed, unsubscribe) => {
            dispatch.first.addOne()
            unsubscribe()
          },
        }
      }
      const other = common
      init({
        models: { first, other },
        plugins: [subscriptionsPlugin()]
      })

      dispatch.other.addOne()
      dispatch.other.addOne()
      dispatch.other.addOne()

      expect(getStore().getState()).toEqual({
        other: 3, first: 1,
      })
    })
  })
})
