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
    } = require('../src')
    const first = {
      name: 'first',
      ...common,
      subscriptions: {
        'second/addOne': () => dispatch.first.addOne(),
      }
    }
    const second = {
      name: 'second',
      ...common,
    }
    init({
      models: { first, second }
    })

    dispatch.second.addOne()

    expect(getStore().getState()).toEqual({
      second: 1, first: 1,
    })
  })

  test('should allow for two subscriptions with same name in different models', () => {
    const {
      init, dispatch, getStore
    } = require('../src')
    const a1 = {
      name: 'a1',
      ...common,
      subscriptions: {
        'b1/addOne': () => dispatch.a1.addOne(),
      }
    }
    const b1 = {
      name: 'b1',
      ...common,
    }
    const c1 = {
      name: 'c1',
      ...common,
      subscriptions: {
        'b1/addOne': () => dispatch.c1.addOne(),
      },
    }
    init({
      models: { a1, b1, c1 }
    })

    dispatch.b1.addOne()

    expect(getStore().getState()).toEqual({
      a1: 1, b1: 1, c1: 1,
    })
  })

  test('should allow for three subscriptions with same name in different models', () => {
    const {
      init, dispatch, getStore
    } = require('../src')
    const a = {
      name: 'a',
      ...common,
      subscriptions: {
        'b/addOne': () => dispatch.a.addOne(),
      }
    }
    const b = {
      name: 'b',
      ...common,
    }
    const c = {
      name: 'c',
      ...common,
      subscriptions: {
        'b/addOne': () => dispatch.c.addOne(),
      },
    }
    const d = {
      name: 'd',
      ...common,
      subscriptions: {
        'b/addOne': () => dispatch.d.addOne(),
      },
    }
    // no subscriptions, superfluous model
    // just an additional check to see that
    // other models are not effected
    const e = {
      name: 'e',
      ...common,
    }
    init({
      models: {
        a, b, c, d, e
      }
    })

    dispatch.b.addOne()

    expect(getStore().getState()).toEqual({
      a: 1, b: 1, c: 1, d: 1, e: 0
    })
  })

  test('should throw if a subscription matcher is invalid', () => {
    const { model, init, dispatch } = require('../src')
    init()

    expect(() => model({
      name: 'first',
      ...common,
      subscriptions: {
        'Not/A/Valid/Matcher': () => dispatch.first.addOne(),
      }
    })).toThrow()
  })

  test('should enforce subscriptions are functions', () => {
    const { model, init } = require('../src')
    init()

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
      } = require('../src')
      const first = {
        name: 'first',
        ...common,
        subscriptions: {
          'second/*': () => dispatch.first.addOne(),
        }
      }
      const second = {
        name: 'second',
        ...common,
      }
      init({
        models: { first, second }
      })

      dispatch.second.addOne()

      expect(getStore().getState()).toEqual({
        second: 1, first: 1,
      })
    })

    test('should create working pattern matching subsription (*/addOne)', () => {
      const {
        init, dispatch, getStore
      } = require('../src')
      const first = {
        name: 'first',
        ...common,
        subscriptions: {
          '*/add': () => dispatch.first.addOne(),
        }
      }
      const second = {
        name: 'second',
        state: 0,
        reducers: {
          add: (state, payload) => state + payload
        }
      }
      init({
        models: { first, second }
      })

      dispatch.second.add(2)

      expect(getStore().getState()).toEqual({
        second: 2, first: 1,
      })
    })

    test('should create working pattern matching subscription (second/add*)', () => {
      const {
        init, dispatch, getStore
      } = require('../src')
      const first = {
        name: 'first',
        ...common,
        subscriptions: {
          'second/add*': () => dispatch.first.addOne(),
        }
      }
      const second = {
        name: 'second',
        ...common,
      }
      init({
        models: { first, second }
      })

      dispatch.second.addOne()

      expect(getStore().getState()).toEqual({
        second: 1, first: 1,
      })
    })

    test('should throw an error if a user creates a subscription that matches a reducer in the model', () => {
      const { model, init } = require('../src')
      init()

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
      const { model, init } = require('../src')
      init()

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
      const { model, init } = require('../src')
      init()

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

  describe('unsubscribe:', () => {
    test('a matched action', () => {
      const {
        init, dispatch, getStore
      } = require('../src')
      const { createUnsubscribe } = require('../src/plugins/subscriptions/unsubscribe')
      const first = {
        name: 'first',
        ...common,
        subscriptions: {
          'second/addOne': () => dispatch.first.addOne(),
        }
      }
      const second = {
        name: 'second',
        ...common,
      }
      init({
        models: { first, second }
      })
      const handler = { first: () => {} }
      const unsubscribe = createUnsubscribe(handler, 'second/addOne')
      unsubscribe()
      dispatch.second.addOne()

      expect(getStore().getState()).toEqual({
        second: 1, first: 0,
      })
    })
    test('a pattern matched action', () => {
      const {
        init, dispatch, getStore
      } = require('../src')
      const { createUnsubscribe } = require('../src/plugins/subscriptions/unsubscribe')
      const first = {
        name: 'first',
        ...common,
        subscriptions: {
          'second/*': () => dispatch.first.addOne(),
        }
      }
      const second = {
        name: 'second',
        ...common,
      }
      init({
        models: { first, second }
      })

      const handler = { first: () => {} }
      const unsubscribe = createUnsubscribe(handler, 'second/*')
      unsubscribe()
      dispatch.second.addOne()

      expect(getStore().getState()).toEqual({
        second: 1, first: 0,
      })
    })
    test('a pattern matched action when more than one', () => {
      const {
        init, dispatch, getStore
      } = require('../src')
      const { createUnsubscribe } = require('../src/plugins/subscriptions/unsubscribe')
      const first = {
        name: 'first',
        ...common,
        subscriptions: {
          'second/*': () => dispatch.first.addOne(),
        }
      }
      const second = {
        name: 'second',
        ...common,
      }
      const third = {
        name: 'third',
        ...common,
        subscriptions: {
          'second/*': () => dispatch.third.addOne(),
        }
      }
      init({
        models: { first, second, third }
      })
      const handler = { first: () => {} }
      const unsubscribe = createUnsubscribe(handler, 'second/*')
      unsubscribe()
      dispatch.second.addOne()

      expect(getStore().getState()).toEqual({
        first: 0, second: 1, third: 1
      })
    })
    test('should throw if invalid action', () => {
      const { init, dispatch } = require('../src')
      const { createUnsubscribe } = require('../src/plugins/subscriptions/unsubscribe')
      const first = {
        name: 'first',
        ...common,
        subscriptions: {
          'second/addOne': () => dispatch.first.addOne(),
        }
      }
      init({
        models: { first }
      })

      const handler = { first: () => {} }
      const unsubscribe = createUnsubscribe(handler, 'an/invalid/action')

      expect(unsubscribe).toThrow()
    })
    test('should do nothing if no action', () => {
      const {
        init, dispatch, getStore
      } = require('../src')
      const { createUnsubscribe } = require('../src/plugins/subscriptions/unsubscribe')
      const first = {
        name: 'first',
        ...common,
        subscriptions: {
          'second/addOne': () => dispatch.first.addOne(),
        }
      }
      const second = {
        name: 'second',
        ...common,
      }
      init({
        models: { first, second }
      })

      const handler = { first: () => {} }
      const unsubscribe = createUnsubscribe(handler, 'not/existing')
      unsubscribe()
      dispatch.second.addOne()

      expect(getStore().getState()).toEqual({
        second: 1, first: 1,
      })
    })
  })
  xtest('should allow unsubscribe within a model', () => {
    const {
      init, dispatch, getStore
    } = require('../src')
    const first = {
      name: 'first',
      ...common,
      subscriptions: {
        'second/addOne': (action, unsubscribe) => {
          dispatch.first.addOne()
          console.log('unsubscribe', action, unsubscribe)
          unsubscribe()
        },
      }
    }
    const second = {
      name: 'second',
      ...common,
    }
    init({
      models: { first, second }
    })

    dispatch.second.addOne()
    dispatch.second.addOne()
    dispatch.second.addOne()
    
    expect(getStore().getState()).toEqual({
      second: 3, first: 1,
    })
  })
})
