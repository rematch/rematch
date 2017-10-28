beforeEach(() => {
  jest.resetModules()
})

describe('plugin:', () => {
  describe('loading:', () => {
    it('should load the plugin with no config', () => {
      const { init, getStore } = require('../../../src')
      const loadingPlugin = require('../src').default
      const plugin = loadingPlugin()
      init({
        plugins: [plugin]
      })
      expect(getStore().getState()).toEqual({
        loading: {
          global: false,
          models: {}
        }
      })
    })

    it('should load the plugin with name config', () => {
      const { init, getStore } = require('../../../src')
      const loadingPlugin = require('../src').default
      const plugin = loadingPlugin({ name: 'otherName' })
      init({
        plugins: [plugin]
      })
      expect(getStore().getState()).toEqual({
        otherName: {
          global: false,
          models: {}
        }
      })
    })

    it('should load the plugin with effects enabled', () => {
      const { init, getStore } = require('../../../src')
      const loadingPlugin = require('../src').default
      const plugin = loadingPlugin({ effects: true })
      init({
        plugins: [plugin]
      })
      expect(getStore().getState()).toEqual({
        loading: {
          global: false,
          models: {},
          effects: {},
        }
      })
    })

    it('should outline each model as an empty object', () => {
      const { init, model, getStore } = require('../../../src')
      const loadingPlugin = require('../src').default
      const plugin = loadingPlugin({ effects: true })
      init({
        plugins: [plugin]
      })
      model({
        name: 'count',
        state: 0
      })
      expect(getStore().getState().loading.models).toEqual({
        count: {},
      })
    })
  })
})
