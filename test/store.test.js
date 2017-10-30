beforeEach(() => {
  jest.resetModules()
})

describe('createStore:', () => {
  it('no params should create store with state `{}`', () => {
    const { createStore, getStore } = require('../src/redux/store')
    createStore()

    expect(getStore().getState()).toEqual({})
  })

  it('initialState `null` should create store with state `null`', () => {
    const { createStore, getStore } = require('../src/redux/store')
    createStore({
      initialState: null
    })

    expect(getStore().getState()).toEqual(null)
  })

  it('initialState `{ app: "hello, world" }` should create store with state `{ app: "hello, world" }`', () => {
    const { createStore, getStore } = require('../src/redux/store')
    createStore({
      initialState: { app: 'hello, world' }
    })

    expect(getStore().getState()).toEqual({ app: 'hello, world' })
  })

  it('extraReducers should create store with extra reducers', () => {
    const { createStore, getStore } = require('../src/redux/store')
    const extraReducers = { todos: (state = 999) => state }
    createStore({
      extraReducers
    })
    expect(getStore().getState()).toEqual({ todos: 999 })
  })

  it('customCombineReducers should run a function over combineReducers', () => {
    const { createStore, getStore } = require('../src/redux/store')
    const customCombineReducers = () => s => ({ a: s.a * 2 })
    createStore({
      initialState: { a: 2 },
      customCombineReducers,
    })
    expect(getStore().getState()).toEqual({ a: 4 })
  })
})
