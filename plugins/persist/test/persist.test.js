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

describe('persist', () => {
  test('should load the persist plugin with no config', () => {
    const persistPlugin = require('../src').default
    const { init, getStore } = require('../../../src')
    init({
      initialState: {},
      plugins: [persistPlugin()]
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
      plugins: [persistPlugin()]
    })
    const persistor = getPersistor()
    expect(persistor.purge).toBeDefined()
  })
})
