import { model, init, dispatch, getStore } from '../src/index'

beforeEach(() => {
  jest.resetModules()
})

describe('hooks:', () => {
  test('should create an action', () => {
    init()

    model({
      name: 'first',
      state: 0,
      reducers: {
        addOne: (state) => state + 1,
      },
      hooks: {
        'second/addOne': () => dispatch.first.addOne(),
      }
    })

    model({
      name: 'second',
      state: 0,
      reducers: {
        addOne: (state) => state + 1,
      },
    })

    dispatch.second.addOne()

    expect(getStore().getState()).toEqual({
      second: 1, first: 1,
    })
  })
})
