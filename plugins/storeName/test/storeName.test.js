const { default: storeNamePlugin, STORE_NAME_KEY } = require('../src')
const { init } = require('../../../src')

describe('store name:', () => {
  test('should throw if name config is not a string', () => {
    const storeNamePlugin = require('../src').default
    const { init } = require('../../../src')

    const start = () => {
      init({ plugins: [ storeNamePlugin({ name: (error) => error }) ] })
    }

    expect(start).toThrow()
  })

  it('should expose the store name', async () => {
    const store = init({
      plugins: [storeNamePlugin()]
    })

    const state = store.getState()
    expect(state).toEqual({
      [STORE_NAME_KEY]: store.name
    })
  })

  it('should expose the store name with a configured key', async () => {
    const store = init({
      plugins: [storeNamePlugin({
        name: 'chicken'
      })]
    })

    const state = store.getState()
    expect(state).toEqual({
      'chicken': store.name
    })
  })
})
