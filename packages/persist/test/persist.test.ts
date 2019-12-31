/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
import { init } from '@rematch/core'
import { createAsyncStorageMock } from './localStorage.mock'
import persistPlugin, { getPersistor } from '../src'

beforeEach(() => {
  jest.resetModules()
})

const defaultPersist = {
  rehydrated: false,
  version: -1,
}

// used to prevent warning if no reducers
const reducers = { todos: (state = 999) => state }

describe('persist', () => {
  test('should load the persist plugin with a basic config', () => {
    const store = init({
      plugins: [
        persistPlugin({ key: 'root', storage: createAsyncStorageMock() }),
      ],
      redux: {
        initialState: {},
        reducers,
      },
    })
    expect(store.getState()._persist).toEqual(defaultPersist)
  })

  test('should load the persist plugin with a config', () => {
    const storage = createAsyncStorageMock()
    const plugin = persistPlugin({
      key: 'test',
      version: 2,
      storage,
    })
    const store = init({
      plugins: [plugin],
      redux: {
        reducers,
      },
    })
    expect(store.getState()._persist).toEqual({
      ...defaultPersist,
      version: 2,
    })
  })

  test('should create a persistor', () => {
    const storage = createAsyncStorageMock()
    init({
      plugins: [
        persistPlugin({
          key: 'root',
          storage,
        }),
      ],
      redux: {
        initialState: {},
        reducers,
      },
    })
    const persistor = getPersistor()
    expect(persistor.purge).toBeDefined()
  })

  test('should work with init models', () => {
    const storage = createAsyncStorageMock()
    const a = {
      name: 'a',
      state: { b: 1 },
      reducers: {
        addOne: s => ({ b: s.b + 1 }),
      },
    }
    const store = init({
      plugins: [persistPlugin({ key: 'root', storage })],
      models: { a },
    })
    store.dispatch.a.addOne()
    const persistor = getPersistor()
    expect(persistor.purge).toBeDefined()
    expect(store.getState()._persist).toEqual(defaultPersist)
    expect(store.getState().a).toEqual({ b: 2 })
  })

  test('should allow resetting state', () => {
    const storage = createAsyncStorageMock()
    const count = {
      state: 0,
      reducers: {
        addOne(state) {
          return state + 1
        },
      },
    }
    const store = init({
      models: { count },
      plugins: [persistPlugin({ key: 'root', storage })],
      redux: {
        rootReducers: {
          PURGE: () => {
            return undefined
          },
        },
      },
    })
    store.dispatch.count.addOne()
    store.dispatch.count.addOne()
    store.dispatch({ type: 'PURGE' })
    getPersistor().purge()

    expect(store.getState().count).toBe(0)
  })
})
