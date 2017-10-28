beforeEach(() => {
  jest.resetModules()
})

describe('createStore:', () => {
  it('no params should create store with state `{}`', () => {
    const { createStore, getStore } = require('../src/utils/store')
    createStore()

    expect(getStore().getState()).toEqual({})
  })

  it('initialState `null` should create store with state `null`', () => {
    const { createStore, getStore } = require('../src/utils/store')
    createStore(null)

    expect(getStore().getState()).toEqual(null)
  })

  it('initialState `{ app: "hello, world" }` should create store with state `{ app: "hello, world" }`', () => {
    const { createStore, getStore } = require('../src/utils/store')
    createStore({ app: 'hello, world' })

    expect(getStore().getState()).toEqual({ app: 'hello, world' })
  })

  it('extraReducers should create store with extra reducers', () => {
    const { createStore, getStore } = require('../src/utils/store')
    const extraReducers = { todos: (state = 999) => state }
    createStore(undefined, extraReducers)
    expect(getStore().getState()).toEqual({ todos: 999 })
  })
})
