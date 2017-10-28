beforeEach(() => {
  jest.resetModules()
})

describe('plugin:', () => {
  describe('loading:', () => {
    it('should change the loading.global', () => {
      const { init, model, dispatch, getStore } = require('../../../src')
      const loadingPlugin = require('../src').default
      const plugin = loadingPlugin()
      init({
        plugins: [plugin]
      })
      model({
        name: 'count',
        state: 0,
        effects: {
          async timeout() {
            await setTimeout(() => {}, 1000)
          }
        }
      })
      dispatch.count.timeout()
      expect(getStore().getState().loading.global).toBe(true)
    })
    it('should change the loading.models', () => {
      const { init, model, dispatch, getStore } = require('../../../src')
      const loadingPlugin = require('../src').default
      const plugin = loadingPlugin()
      init({
        plugins: [plugin]
      })
      model({
        name: 'count',
        state: 0,
        effects: {
          async timeout() {
            await setTimeout(() => {}, 1000)
          }
        }
      })
      dispatch.count.timeout()
      expect(getStore().getState().loading.models).toBe(true)
    })
    it('should change the loading.effects', () => {
      const { init, model, dispatch, getStore } = require('../../../src')
      const loadingPlugin = require('../src').default
      const plugin = loadingPlugin({ effects: true })
      init({
        plugins: [plugin]
      })
      model({
        name: 'count',
        state: 0,
        effects: {
          async timeout() {
            await setTimeout(() => {}, 1000)
          }
        }
      })
      dispatch.count.timeout()
      expect(getStore().getState().loading.effects).toBe({
        timeout: true,
      })
    })
  })
})
