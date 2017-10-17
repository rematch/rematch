// Test for internal store
import { createStore, getStore } from '../src/utils/store'

beforeEach(() => {
  jest.resetModules()
})

describe('createStore:', () => {
  it('no params should create store with state `{}`', () => {
    createStore()

    expect(getStore().getState()).toEqual({})
  })

  it('initialState `null` should create store with state `null`', () => {
    createStore(null)

    expect(getStore().getState()).toEqual(null)
  })

  it('initialState `{ app: "hello, world" }` should create store with state `{ app: "hello, world" }`', () => {
    createStore({ app: 'hello, world' })

    expect(getStore().getState()).toEqual({ app: 'hello, world' })
  })

  xit('extraReducers should create store with extra reducers', () => {
    const extraReducers = { todos: (state = 999) => state }
    createStore(undefined, [], extraReducers)
    expect(getStore().getState()).toEqual({ todos: 999 })
  })
})
