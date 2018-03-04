beforeEach(() => {
  jest.resetModules()
})

describe('createStore:', () => {
  it('no params should create store with state `{}`', () => {
    const { init } = require('../src')
    const store = init()

    expect(store.getState()).toEqual({})
  })

  it('initialState `null` should create store with state `null`', () => {
    const { init } = require('../src')
    const store = init({
      redux: {
        initialState: null,
      }
    })

    expect(store.getState()).toEqual(null)
  })

  it('initialState `{ app: "hello, world" }` should create store with state `{ app: "hello, world" }`', () => {
    const { init } = require('../src')
    const store = init({
      redux: {
        initialState: { app: 'hello, world' }
      }
    })

    expect(store.getState()).toEqual({ app: 'hello, world' })
  })

  it('extraReducers should create store with extra reducers', () => {
    const { init } = require('../src')
    const reducers = { todos: (state = 999) => state }
    const store = init({
      redux: {
        reducers
      }
    })
    expect(store.getState()).toEqual({ todos: 999 })
  })

  test('should allow capturing of an action through root reducer', () => {
    const { init, dispatch } = require('../src')
    const store = init({
      redux: {
        initialState: 'INITIAL',
        rootReducers: {
          'MIDDLE': (state, action) => {
            return 'MIDDLE'
          }
        }
      }
    })
    dispatch({ type: 'MIDDLE' })
    expect(store.getState()).toBe('MIDDLE')
  })

  test('should allow capturing of a second action through root reducer', () => {
    const { init, dispatch } = require('../src')
    const store = init({
      redux: {
        initialState: 'INITIAL',
        rootReducers: {
          'MIDDLE': (state, action) => {
            return 'MIDDLE'
          }
        }
      }
    })
    dispatch({ type: 'SOMETHING' })
    expect(store.getState()).toBe('INITIAL')
    dispatch({ type: 'MIDDLE' })
    
    expect(store.getState()).toBe('MIDDLE')
  })

  test('should allow resetting state through root reducer', () => {
    const { init, dispatch } = require('../src')
    const count = {
      state: 0,
      reducers: {
        addOne(state) {
          return state + 1
        }
      }
    }
    const store = init({
      models: { count },
      redux: {
        rootReducers: {
          '@@RESET': (state, action) => {
            return undefined
          },
        }
      }
    })
    dispatch.count.addOne()
    dispatch.count.addOne()
    dispatch({ type: '@@RESET' })
    
    expect(store.getState()).toEqual({ count: 0 })
  })

  test('root reducer should work with dynamic model', () => {
    const { init, dispatch, model } = require('../src')
    const store = init({
      models: {
        countA: { state: 0, reducers: { up: s => s + 1 } },
        countB: { state: 0 }
      },
      redux: {
        rootReducers: {
          '@@RESET': (state, action) => {
            return undefined
          },
        }
      }
    })

    store.model({ name: 'countC', state: 0 })

    dispatch.countA.up()
    dispatch({ type: '@@RESET' })

    expect(store.getState()).toEqual({ countA: 0, countB: 0, countC: 0 })
  })
})
