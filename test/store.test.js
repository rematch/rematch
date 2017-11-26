beforeEach(() => {
  jest.resetModules()
})

describe('createStore:', () => {
  it('no params should create store with state `{}`', () => {
    const { init, getStore } = require('../build')
    init()

    expect(getStore().getState()).toEqual({})
  })

  it('initialState `null` should create store with state `null`', () => {
    const { init, getStore } = require('../build')
    init({
      redux: {
        initialState: null,
      }
    })

    expect(getStore().getState()).toEqual(null)
  })

  it('initialState `{ app: "hello, world" }` should create store with state `{ app: "hello, world" }`', () => {
    const { init, getStore } = require('../build')
    init({
      redux: {
        initialState: { app: 'hello, world' }
      }
    })

    expect(getStore().getState()).toEqual({ app: 'hello, world' })
  })

  it('extraReducers should create store with extra reducers', () => {
    const { init, getStore } = require('../build')
    const reducers = { todos: (state = 999) => state }
    init({
      redux: {
        reducers
      }
    })
    expect(getStore().getState()).toEqual({ todos: 999 })
  })
})
