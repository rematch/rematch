const { init } = require('../../../src')
const updatedPlugin = require('../src').default
const mockDate = new Date()


beforeEach(() => {
  jest.resetModules()
  global.Date = jest.fn(() => mockDate)
})

describe('updated', () => {
  test('should setup with a config name', async () => {
    const count = {
      name: 'count',
      state: 0,
      reducers: {
        addOne: s => s + 1
      },
      effects: {
        async timeout() {
          this.addOne()
        }
      }
    }

    const store = init({
      models: { count },
      plugins: [updatedPlugin({
        name: 'chicken',
      })]
    })

    await store.dispatch.count.timeout()

    const state = store.getState()
    expect(state).toEqual({
      count: 1,
      chicken: {
        count: {
          timeout: mockDate,
        }
      }
    })
  })
  test('should record the timestamp of the last time an effect was updated', async () => {
    const count = {
      name: 'count',
      state: 0,
      reducers: {
        addOne: s => s + 1
      },
      effects: {
        async timeout() {
          this.addOne()
        }
      }
    }

    const store = init({
      models: { count },
      plugins: [updatedPlugin()]
    })

    await store.dispatch.count.timeout()

    const state = store.getState()
    expect(state).toEqual({
      count: 1,
      updated: {
        count: {
          timeout: mockDate,
        }
      }
    })
  })
  
  test('should work with multiple effects', async () => {
    const count = {
      name: 'count',
      state: 0,
      reducers: {
        addOne: s => s + 1
      },
      effects: {
        async timeout() {
          this.addOne()
        },
        async timeout2() {
          this.addOne()
        }
      }
    }

    const store = init({
      models: { count },
      plugins: [updatedPlugin()]
    })

    await store.dispatch.count.timeout()
    await store.dispatch.count.timeout2()

    const state = store.getState()
    expect(state).toEqual({
      count: 2,
      updated: {
        count: {
          timeout: mockDate,
          timeout2: mockDate,
        }
      }
    })
  })
})
