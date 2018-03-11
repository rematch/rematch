const { init } = require('../src')

beforeEach(() => {
  jest.resetModules()
})

describe('createStore:', () => {
  it('no params should create store with state `{}`', () => {
    const store = init()

    expect(store.getState()).toEqual({})
  })

  it('initialState `null` should create store with state `null`', () => {
    const store = init({
      redux: {
        initialState: null,
      }
    })

    expect(store.getState()).toEqual(null)
  })

  it('initialState `{ app: "hello, world" }` should create store with state `{ app: "hello, world" }`', () => {
    const store = init({
      redux: {
        initialState: { app: 'hello, world' }
      }
    })

    expect(store.getState()).toEqual({ app: 'hello, world' })
  })

  it('extraReducers should create store with extra reducers', () => {
    const reducers = { todos: (state = 999) => state }
    const store = init({
      redux: {
        reducers
      }
    })
    expect(store.getState()).toEqual({ todos: 999 })
  })

  test('should allow capturing of an action through root reducer', () => {
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
    store.dispatch({ type: 'MIDDLE' })
    expect(store.getState()).toBe('MIDDLE')
  })

  test('should allow capturing of a second action through root reducer', () => {
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
    store.dispatch({ type: 'SOMETHING' })
    expect(store.getState()).toBe('INITIAL')
    store.dispatch({ type: 'MIDDLE' })
    
    expect(store.getState()).toBe('MIDDLE')
  })

  test('should allow resetting state through root reducer', () => {
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
    store.dispatch.count.addOne()
    store.dispatch.count.addOne()
    store.dispatch({ type: '@@RESET' })
    
    expect(store.getState()).toEqual({ count: 0 })
  })

  test('root reducer should work with dynamic model', () => {
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

    store.dispatch.countA.up()
    store.dispatch({ type: '@@RESET' })

    expect(store.getState()).toEqual({ countA: 0, countB: 0, countC: 0 })
  })
})
