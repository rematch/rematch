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

  test('should allow capturing of an action through middleware', () => {
    const { init, dispatch } = require('../src')
    const rootReducerWrapper = (next) => (state, action) => {
      if (action.type === 'MIDDLE') {
        return 'MIDDLE'
      }
      return next(action)
    }
    const store = init({
      redux: {
        initialState: 'INITIAL',
        rootReducerWrapper,
      }
    })
    dispatch({ type: 'MIDDLE' })
    expect(store.getState()).toBe('MIDDLE')
  })

  test('should allow capturing of a second action through middleware', () => {
    const { init, dispatch } = require('../src')
    const rootReducerWrapper = (rootReducer) => (state, action) => {
      if (action.type === 'MIDDLE') {
        return 'MIDDLE'
      }
      return rootReducer(state, action)
    }
    const store = init({
      redux: {
        initialState: 'INITIAL',
        rootReducerWrapper,
      }
    })
    dispatch({ type: 'SOMETHING' })
    expect(store.getState()).toBe('INITIAL')
    dispatch({ type: 'MIDDLE' })
    
    expect(store.getState()).toBe('MIDDLE')
  })
})
