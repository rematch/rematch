const mockDate = new Date()

beforeEach(() => {
  jest.resetModules()
  global.Date = jest.fn(() => mockDate)
})

describe('updated', () => {
  test('should setup with a config name', async () => {
    const {
      init, dispatch
    } = require('../../../src')

    const updatedPlugin = require('../src').default

    const count = {
      name: 'count',
      state: 0,
      reducers: {
        addOne: s => s + 1
      },
      effects: {
        async timeout() {
          dispatch.count.addOne()
        }
      }
    }

    const store = init({
      models: { count },
      plugins: [updatedPlugin({
        name: 'chicken',
      })]
    })

    await dispatch.count.timeout()

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
    const {
      init, dispatch
    } = require('../../../src')

    const updatedPlugin = require('../src').default

    const count = {
      name: 'count',
      state: 0,
      reducers: {
        addOne: s => s + 1
      },
      effects: {
        async timeout() {
          dispatch.count.addOne()
        }
      }
    }

    const store = init({
      models: { count },
      plugins: [updatedPlugin()]
    })

    await dispatch.count.timeout()

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
    const {
      init, dispatch
    } = require('../../../src')

    const updatedPlugin = require('../src').default

    const count = {
      name: 'count',
      state: 0,
      reducers: {
        addOne: s => s + 1
      },
      effects: {
        async timeout() {
          dispatch.count.addOne()
        },
        async timeout2() {
          dispatch.count.addOne()
        }
      }
    }

    const store = init({
      models: { count },
      plugins: [updatedPlugin()]
    })

    await dispatch.count.timeout()
    await dispatch.count.timeout2()

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
