import { model, init, getStore, dispatch } from '../src'

beforeEach(() => {
  jest.resetModules()
})

describe('dispatch:', () => {
  describe('action:', () => {
    it('should be call in the form "modelName/reducerName"', () => {
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

  describe('params:', () => {
    test('should pass state as the first reducer param', () => {
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
})
