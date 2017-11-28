/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
const createLocalStorageMock = require('./localStorage.mock')

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
  test('should throw if no config', () => {
    const persistPlugin = require('../src').default
    const { init, getStore } = require('../../../src')
    const storage = createLocalStorageMock()
    const callInit = () => init({
      plugins: [persistPlugin()],
      redux: {
        initialState: {},
        reducers,
      }
    })
    expect(callInit).toThrow()
  })

  test('should load the persist plugin with a basic config', () => {
    const persistPlugin = require('../src').default
    const { init, getStore } = require('../../../src')
    const storage = createLocalStorageMock()
    init({
      plugins: [persistPlugin({
        storage,
      })],
      redux: {
        initialState: {},
        reducers,
      }
    })
    expect(getStore().getState()._persist).toEqual(defaultPersist)
  })

  test('should load the persist plugin with a config', () => {
    const persistPlugin = require('../src').default
    const { init, getStore } = require('../../../src')
    const storage = createLocalStorageMock()
    const plugin = persistPlugin({
      key: 'test',
      version: 2,
      storage,
    })
    init({
      plugins: [plugin],
      redux: {
        reducers,
      }
    })
    expect(getStore().getState()._persist).toEqual({
      ...defaultPersist,
      version: 2,
    })
  })

  test('should create a persistor', () => {
    const persistPlugin = require('../src').default
    const { getPersistor } = require('../src')
    const { init } = require('../../../src')
    const storage = createLocalStorageMock()
    init({
      plugins: [persistPlugin({
        storage
      })],
      redux: {
        initialState: {},
        reducers,
      }
    })
    const persistor = getPersistor()
    expect(persistor.purge).toBeDefined()
  })

  test('should work with init models', () => {
    const persistPlugin = require('../src').default
    const { getPersistor } = require('../src')
    const { init, dispatch, getStore } = require('../../../src')
    const storage = createLocalStorageMock()
    const a = {
      name: 'a',
      state: { b: 1 },
      reducers: {
        addOne: s => ({ b: s.b + 1 })
      }
    }
    init({
      plugins: [persistPlugin({ storage })],
      models: { a }
    })
    dispatch.a.addOne()
    const persistor = getPersistor()
    expect(persistor.purge).toBeDefined()
    expect(getStore().getState()._persist).toEqual(defaultPersist)
    expect(getStore().getState().a).toEqual({ b: 2 })
  })
})
