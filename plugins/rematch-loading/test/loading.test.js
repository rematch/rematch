beforeEach(() => {
  jest.resetModules()
})

describe('plugin:', () => {
  describe('loading:', () => {
    it('should run a test', () => {
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
  })
})
