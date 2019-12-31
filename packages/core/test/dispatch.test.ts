/* eslint-disable @typescript-eslint/explicit-function-return-type,@typescript-eslint/ban-ts-ignore */
import { init } from '../src'

describe('dispatch:', () => {
  describe('action:', () => {
    it('should be called in the form "modelName/reducerName"', () => {
      const count = {
        state: 0,
        reducers: {
          add: state => state + 1,
        },
      }
      const store = init({
        models: { count },
      })

      store.dispatch({ type: 'count/add' })

      expect(store.getState()).toEqual({
        count: 1,
      })
    })

    test('should be able to call dispatch directly', () => {
      const count = {
        state: 0,
        reducers: {
          addOne: state => state + 1,
        },
      }

      const store = init({
        models: { count },
      })

      store.dispatch({ type: 'count/addOne' })

      expect(store.getState()).toEqual({
        count: 1,
      })
    })

    test('should dispatch an action', () => {
      const count = {
        state: 0,
        reducers: {
          add: state => state + 1,
        },
      }

      const store = init({
        models: { count },
      })

      store.dispatch.count.add()

      expect(store.getState()).toEqual({
        count: 1,
      })
    })

    test('should dispatch multiple actions', () => {
      const count = {
        state: 0,
        reducers: {
          add: state => state + 1,
        },
      }

      const store = init({
        models: { count },
      })

      store.dispatch.count.add()
      store.dispatch.count.add()

      expect(store.getState()).toEqual({
        count: 2,
      })
    })

    test('should handle multiple models', () => {
      const a = {
        state: 42,
        reducers: {
          add: state => state + 1,
        },
      }

      const b = {
        state: 0,
        reducers: {
          add: state => state + 1,
        },
      }

      const store = init({
        models: { a, b },
      })

      store.dispatch.a.add()
      store.dispatch.b.add()

      expect(store.getState()).toEqual({
        a: 43,
        b: 1,
      })
    })
  })

  test('should include a payload if it is a false value', () => {
    const a = {
      state: true,
      reducers: {
        toggle: (_state, payload) => payload,
      },
    }

    const store = init({
      models: { a },
    })

    store.dispatch.a.toggle(false)

    expect(store.getState()).toEqual({
      a: false,
    })
  })

  test('should throw if the reducer name is invalid', () => {
    const store = init()

    expect(() =>
      store.model({
        name: 'a',
        state: 42,
        reducers: {
          'model/invalid/name': () => 43,
        },
      })
    ).toThrow()
  })

  test('should throw if the reducer is not a function', () => {
    const store = init()

    expect(() =>
      store.model({
        name: 'a',
        state: 42,
        reducers: {
          is43: 43,
        },
      } as any)
    ).toThrow()
  })

  describe('params:', () => {
    test('should pass state as the first reducer param', () => {
      const count = {
        state: 0,
        reducers: {
          doNothing: state => state,
        },
      }

      const store = init({
        models: { count },
      })

      store.dispatch.count.doNothing()

      expect(store.getState()).toEqual({
        count: 0,
      })
    })

    test('should pass payload as the second param', () => {
      const count = {
        state: 1,
        reducers: {
          incrementBy: (state, payload) => state + payload,
        },
      }

      const store = init({
        models: { count },
      })

      store.dispatch.count.incrementBy(5)

      expect(store.getState()).toEqual({
        count: 6,
      })
    })

    test('should pass the meta object as the third param', async () => {
      const count = {
        state: 1,
        reducers: {
          incrementBy: (state, payload, meta) => {
            expect(meta).toEqual({ metaProperty: false })
            return state + payload
          },
        },
      }

      const store = init({
        models: { count },
      })

      await store.dispatch.count.incrementBy(5, { metaProperty: false })
    })

    test('should use second param as action meta', done => {
      const count = {
        state: 1,
        reducers: {
          incrementBy: (state, payload) => state + payload,
        },
      }

      // TODO: capture actions in a more direct way
      const store = init({
        models: { count },
        plugins: [
          {
            createMiddleware: () => () => next => action => {
              if (action.meta) {
                expect(action).toEqual({
                  type: 'count/incrementBy',
                  payload: 5,
                  meta: { metaProperty: true },
                })
                done()
              }
              return next(action)
            },
          },
        ],
      })
      store.dispatch.count.incrementBy(5, { metaProperty: true })
    })
  })

  describe('promise middleware', () => {
    test('should return a promise from an action', () => {
      const count = {
        state: 0,
        reducers: {
          add: state => state + 1,
        },
      }

      const store = init({
        models: { count },
      })

      const dispatched = store.dispatch.count.add()

      expect(typeof dispatched).toBe('object')
    })

    test('should return a promise from an effect', () => {
      const count = {
        state: 0,
        reducers: {
          addOne: state => state + 1,
        },
        effects: {
          async callAddOne() {
            // @ts-ignore
            this.addOne()
          },
        },
      }

      const store = init({
        models: { count },
      })

      const dispatched = store.dispatch.count.callAddOne()

      // @ts-ignore
      expect(typeof dispatched.then).toBe('function')
    })

    test('should return a promise that resolves to a value from an effect', async () => {
      const count = {
        state: 0,
        reducers: {
          addOne: state => state + 1,
        },
        effects: {
          async callAddOne() {
            // @ts-ignore
            this.addOne()
            return {
              added: true,
            }
          },
        },
      }

      const store = init({
        models: { count },
      })

      const dispatched = store.dispatch.count.callAddOne()
      const value = await dispatched

      // @ts-ignore
      expect(typeof dispatched.then).toBe('function')
      expect(value).toEqual({ added: true })
    })
  })
  test('should not validate dispatch if production', () => {
    process.env.NODE_ENV = 'production'

    const count = {
      state: 0,
      reducers: {
        'add/invalid': state => state + 1,
      },
    }

    expect(() =>
      init({
        models: { count },
      })
    ).not.toThrow()
  })
})
