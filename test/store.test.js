// Test for internal store
import { createStore, _store } from '../src/store'

beforeEach(() => {
  jest.resetModules()
})

describe('createStore', () => {
  it('no params should create store with state `{}`', () => {
    createStore()

    expect(_store.getState()).toEqual({})
  })

  it('initialState `null` should create store with state `null`', () => {
    createStore(null)

    expect(_store.getState()).toEqual(null)
  })

  it('initialState `{ app: "hello, world" }` should create store with state `{ app: "hello, world" }`', () => {
    createStore({ app: 'hello, world' })

    expect(_store.getState()).toEqual({ app: 'hello, world' })
  })

  it('extraReducers should create store with extra reducers', () => {
    const extraReducers = { todos: (state = 999) => state }
    createStore(undefined, [], extraReducers)
    expect(_store.getState()).toEqual({ todos: 999 })
  })
})

