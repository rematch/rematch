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
    const { init } = require('../../../src')
    const a = {
      name: 'a',
      state: { b: 1 }
    }
    init({
      initialState: {},
      plugins: [persistPlugin()],
      models: { a }
    })
    const persistor = getPersistor()
    expect(persistor.purge).toBeDefined()
  })

  test('should load with models instead of extra reducers', () => {
    const { init, model, getStore } = require('../../../src')
    const persistPlugin = require('../src').default
    init({
      initialState: {},
      plugins: [persistPlugin()],
    })
    model({
      name: 'a',
      state: 0,
      reducers: {
        addOne: s => s + 1,
      }
    })
    expect(getStore().getState()._persist).toEqual(defaultPersist)
  })
})
