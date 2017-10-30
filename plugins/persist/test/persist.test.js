/* eslint-disable no-undef */
import createLocalStorageMock from './localStorageMock'

beforeEach(() => {
  jest.resetModules()
  createLocalStorageMock()
})

describe('persist', () => {
  test('should load the persist plugin with no config', () => {
    const persistPlugin = require('../src').default
    const { init, getStore } = require('../../../src')
    init({
      initialState: {},
      plugins: [persistPlugin()]
    })
    expect(getStore()).toEqual({})
  })

  test('should load the persist plugin with a config', () => {
    const persistPlugin = require('../src').default
    const { init, getStore } = require('../../../src')
    const plugin = persistPlugin({
      key: 'test'
    })
    init({
      initialState: {},
      plugins: [plugin]
    })
    expect(getStore()).toEqual({})
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
    expect(persistor).toEqual('persistor')
  })
})
