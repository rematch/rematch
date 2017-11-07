/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
import createLocalStorageMock from './localStorageMock'

beforeEach(() => {
  jest.resetModules()
  createLocalStorageMock()
})

const defaultPersist = {
  rehydrated: false,
  version: -1,
}

// used to prevent warning if no reducers
const extraReducers = { todos: (state = 999) => state }

describe('persist', () => {
  test('should load the persist plugin with no config', () => {
    const persistPlugin = require('../src').default
    const { init, getStore } = require('../../../src')
    init({
      initialState: {},
      plugins: [persistPlugin()],
      extraReducers,
    })
    expect(getStore().getState()._persist).toEqual(defaultPersist)
  })

  test('should load the persist plugin with a config', () => {
    const persistPlugin = require('../src').default
    const { init, getStore } = require('../../../src')
    const plugin = persistPlugin({
      key: 'test',
      version: 2
    })
    init({
      initialState: {},
      plugins: [plugin],
      extraReducers,
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
    init({
      initialState: {},
      plugins: [persistPlugin()],
      extraReducers,
    })
    const persistor = getPersistor()
    expect(persistor.purge).toBeDefined()
  })

  test('should work with init models', () => {
    const persistPlugin = require('../src').default
    const { getPersistor } = require('../src')
    const { init, dispatch, getStore } = require('../../../src')
    const a = {
      name: 'a',
      state: { b: 1 },
      reducers: {
        addOne: s => ({ b: s.b + 1 })
      }
    }
    init({
      plugins: [persistPlugin()],
      models: { a }
    })
    dispatch.a.addOne()
    const persistor = getPersistor()
    expect(persistor.purge).toBeDefined()
    expect(getStore().getState()).toBe({ b: 2 })
  })

  // NOTE: persist may require models to be run on init. Unsure.
  test('should load with model() instead of extra reducers', () => {
    const {
      init, model, dispatch, getStore
    } = require('../../../src')
    const persistPlugin = require('../src').default
    init({
      plugins: [persistPlugin()],
    })
    model({
      name: 'a',
      state: { b: 1 },
      reducers: {
        addOne: s => ({ b: s.b + 1 })
      }
    })
    dispatch.a.addOne()
    expect(getStore().getState()._persist).toEqual(defaultPersist)
    expect(getStore().getState()).toBe({ b: 2 })
  })
})
