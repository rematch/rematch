import { model, init, dispatch, getStore } from '../src'

beforeEach(() => {
  jest.resetModules()
})

const common = {
  state: 0,
  reducers: {
    addOne: (state) => state + 1,
  },
}

describe('subscriptions:', () => {
  test('should create a working subscription', () => {
    init()

    model({
      name: 'first',
      ...common,
      subscriptions: {
        'second/addOne': () => dispatch.first.addOne(),
      }
    })

    model({
      name: 'second',
      ...common,
    })

    dispatch.second.addOne()

    expect(getStore().getState()).toEqual({
      second: 1, first: 1,
    })
  })

  test('should allow for two subscriptions with same name in different models', () => {
    init()

    model({
      name: 'a',
      ...common,
      subscriptions: {
        'b/addOne': () => dispatch.a.addOne(),
      }
    })

    model({
      name: 'b',
      ...common,
    })

    model({
      name: 'c',
      ...common,
      subscriptions: {
        'b/addOne': () => dispatch.c.addOne(),
      },
    })

    dispatch.b.addOne()

    expect(getStore().getState()).toEqual({
      a: 1, b: 1, c: 1,
    })
  })

  test('should allow for three subscriptions with same name in different models', () => {
    init()

    model({
      name: 'a',
      ...common,
      subscriptions: {
        'b/addOne': () => dispatch.a.addOne(),
      }
    })

    model({
      name: 'b',
      ...common,
    })

    model({
      name: 'c',
      ...common,
      subscriptions: {
        'b/addOne': () => dispatch.c.addOne(),
      },
    })

    model({
      name: 'd',
      ...common,
      subscriptions: {
        'b/addOne': () => dispatch.d.addOne(),
      },
    })

    dispatch.b.addOne()

    expect(getStore().getState()).toEqual({
      a: 1, b: 1, c: 1, d: 1
    })
  })

  test('it should throw if a subscription matcher is invalid', () => {
    init()

    expect(() => model({
      name: 'first',
      ...common,
      subscriptions: {
        'Not/A/Valid/Matcher': () => dispatch.first.addOne(),
      }
    })).toThrow()
  })

  // xdescribe('pattern matching', () => {
  //   test('should create working pattern matching subscription (*)', () => {
  //     init()

  //     model({
  //       name: 'first',
  //       ...common,
  //       subscriptions: {
  //         '*': () => dispatch.first.addOne(),
  //       }
  //     })

  //     model({
  //       name: 'second',
  //       ...common,
  //     })

  //     dispatch.second.addOne()

  //     expect(getStore().getState()).toEqual({
  //       second: 1, first: 1,
  //     })
  //   })

  //   test('should create working pattern matching subscription (second/*)', () => {
  //     init()

  //     model({
  //       name: 'first',
  //       ...common,
  //       subscriptions: {
  //         'second/*': () => dispatch.first.addOne(),
  //       }
  //     })

  //     model({
  //       name: 'second',
  //       ...common,
  //     })

  //     dispatch.second.addOne()

  //     expect(getStore().getState()).toEqual({
  //       second: 1, first: 1,
  //     })
  //   })

  //   test('should create working pattern matching subsription (*/addOne)', () => {
  //     init()

  //     model({
  //       name: 'first',
  //       ...common,
  //       subscriptions: {
  //         '*/addOne': () => dispatch.first.addOne(),
  //       }
  //     })

  //     model({
  //       name: 'second',
  //       ...common,
  //     })

  //     dispatch.second.addOne()

  //     expect(getStore().getState()).toEqual({
  //       second: 1, first: 1,
  //     })
  //   })

  //   test('should create working pattern matching subscription (second/add*)', () => {
  //     init()

  //     model({
  //       name: 'first',
  //       ...common,
  //       subscriptions: {
  //         'second/add*': () => dispatch.first.addOne(),
  //       }
  //     })

  //     model({
  //       name: 'second',
  //       ...common,
  //     })

  //     dispatch.second.addOne()

  //     expect(getStore().getState()).toEqual({
  //       second: 1, first: 1,
  //     })
  //   })
  // })
})
