beforeEach(() => {
  jest.resetModules()
})

describe('dispatch:', () => {
  describe('action:', () => {
    it('should be call in the form "modelName/reducerName"', () => {
      const { model, init, getStore } = require('../src')
      init()

      model({
        name: 'count',
        state: 0,
        reducers: {
          add: state => state + 1,
        },
      })

      getStore().dispatch({ type: 'count/add' })

      expect(getStore().getState()).toEqual({
        count: 1,
      })
    })

    test('should be able to call dispatch directly', () => {
      const {
        model, init, getStore, dispatch
      } = require('../src')
      init()

      model({
        name: 'count',
        state: 0,
        reducers: {
          addOne: state => state + 1,
        },
      })

      dispatch({ type: 'count/addOne' })

      expect(getStore().getState()).toEqual({
        count: 1,
      })
    })

    test('should dispatch an action', () => {
      const {
        model, init, getStore, dispatch
      } = require('../src')
      init()

      model({
        name: 'count',
        state: 0,
        reducers: {
          add: state => state + 1,
        },
      })

      dispatch.count.add()

      expect(getStore().getState()).toEqual({
        count: 1,
      })
    })

    test('should dispatch multiple actions', () => {
      const {
        model, init, getStore, dispatch
      } = require('../src')
      init()

      model({
        name: 'count',
        state: 0,
        reducers: {
          add: state => state + 1,
        },
      })

      dispatch.count.add()
      dispatch.count.add()

      expect(getStore().getState()).toEqual({
        count: 2,
      })
    })

    test('should handle multiple models', () => {
      const {
        model, init, getStore, dispatch
      } = require('../src')
      init()

      model({
        name: 'a',
        state: 42,
        reducers: {
          add: state => state + 1,
        },
      })

      model({
        name: 'b',
        state: 0,
        reducers: {
          add: state => state + 1,
        },
      })

      dispatch.a.add()
      dispatch.b.add()

      expect(getStore().getState()).toEqual({
        a: 43,
        b: 1,
      })
    })
  })

  test('should throw if the reducer name is invalid', () => {
    const {
      model, init
    } = require('../src')
    init()

    expect(() => model({
      name: 'a',
      state: 42,
      reducers: {
        'invalid/name': () => 43
      },
    })).toThrow()
  })

  test('should throw if the reducer is not a function', () => {
    const {
      model, init
    } = require('../src')
    init()

    expect(() => model({
      name: 'a',
      state: 42,
      reducers: {
        is43: 43,
      },
    })).toThrow()
  })

  describe('params:', () => {
    test('should pass state as the first reducer param', () => {
      const {
        model, init, getStore, dispatch
      } = require('../src')
      init()

      model({
        name: 'count',
        state: 0,
        reducers: {
          doNothing: state => state,
        },
      })

      dispatch.count.doNothing()

      expect(getStore().getState()).toEqual({
        count: 0,
      })
    })

    test('should pass payload as the second param', () => {
      const {
        model, init, getStore, dispatch
      } = require('../src')
      init()

      model({
        name: 'count',
        state: 1,
        reducers: {
          incrementBy: (state, payload) => state + payload,
        },
      })

      dispatch.count.incrementBy(5)

      expect(getStore().getState()).toEqual({
        count: 6,
      })
    })
  })

  describe('promise middleware', () => {
    test('should return a promise from an action', () => {
      const { model, init, dispatch } = require('../src')
      init()

      model({
        name: 'count',
        state: 0,
        reducers: {
          add: state => state + 1,
        },
      })

      const dispatched = dispatch.count.add()

      expect(typeof dispatched.then).toBe('function')
    })

    test('should return a promise from an effect', () => {
      const { model, init, dispatch } = require('../src')
      init()

      model({
        name: 'count',
        state: 0,
        reducers: {
          addOne: state => state + 1,
        },
        effects: {
          callAddOne() {
            return dispatch.count.addOne()
          }
        }
      })

      const dispatched = dispatch.count.addOne()

      expect(typeof dispatched.then).toBe('function')
    })
  })
})
