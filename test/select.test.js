// Test for internal store
import { init, model, pluginExports, getStore } from '../src/index'
import selectorsPlugin from '../src/plugins/selectors'

beforeEach(() => {
  jest.resetModules()
})

describe('select:', () => {
  it('should populate "select" with selectors in the correct namespace', () => {
    init({
      plugins: [selectorsPlugin(pluginExports)]
    })

    model({
      name: 'app',
      state: 0,
      selectors: {
        selectorWithNoArg: state => state,
        selectorWithArg: (state, arg) => state + arg
      }
    })

    const state = getStore().getState()

    expect(pluginExports).toHaveProperty('select')
    expect(pluginExports.select.app.selectorWithNoArg(state)).toEqual(0)
    expect(pluginExports.select.app.selectorWithArg(state, 2)).toEqual(2)
  })
})
