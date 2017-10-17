import { model, init, dispatch, getStore } from '../src/index'
// import { effects } from '../src/effects'

beforeEach(() => {
  jest.resetModules()
})

xdescribe('effects:', () => {
  test('should create an action', () => {
    init()

    model({
      name: 'count',
      state: 0,
      effects: {
        add: () => 1,
      },
    })

    expect(typeof dispatch.count.add).toBe('function')
  })

  // test('should create an effect', () => {
  //   init()

  //   model({
  //     name: 'example',
  //     state: 0,
  //     effects: {
  //       add: () => 1
  //     },
  //   })

  //   expect(effects['example/add']()).toBe(1)
  // })

  test('should be able to trigger another action', async () => {
    init()

    model({
      name: 'example',
      state: 0,
      reducers: {
        addOne: (state) => state + 1,
      },
      effects: {
        asyncAddOneArrow: async () => {
          await dispatch.example.addOne()
        }
      }
    })

    await dispatch.example.asyncAddOneArrow()

    expect(getStore().getState()).toEqual({
      example: 1,
    })
  })

  // currently no solution for arrow functions as they are often transpiled by Babel or Typescript
  // there is no clear way to detect arrow functions
  xtest('should be able trigger a local reducer using arrow functions and `this`', async () => {
    init()

    model({
      name: 'example',
      state: 0,
      reducers: {
        addOne: (state) => state + 1,
      },
      effects: {
        asyncAddOneArrow: async () => {
          await this.addOne()
        }
      }
    })

    await dispatch.example.asyncAddOneArrow()

    expect(getStore().getState()).toEqual({
      example: 1,
    })
  })

  test('should be able trigger a local reducer using functions and `this`', async () => {
    init()

    model({
      name: 'example',
      state: 0,
      reducers: {
        addOne: (state) => state + 1,
      },
      effects: {
        asyncAddOne: async function () {
          await this.addOne()
        }
      }
    })

    await dispatch.example.asyncAddOne()

    expect(getStore().getState()).toEqual({
      example: 1,
    })
  })

  test('should be able trigger a local reducer using object function shorthand and `this`', async () => {
    init()

    model({
      name: 'example',
      state: 0,
      reducers: {
        addOne: (state) => state + 1,
      },
      effects: {
        async asyncAddOne() {
          await this.addOne()
        }
      }
    })

    await dispatch.example.asyncAddOne()

    expect(getStore().getState()).toEqual({
      example: 1,
    })
  })

  test('should be able to trigger another action with a value', async () => {
    init()

    model({
      name: 'example',
      state: 2,
      reducers: {
        addBy: (state, payload) => state + payload,
      },
      effects: {
        asyncAddBy: async (value) => {
          await dispatch.example.addBy(value)
        }
      }
    })

    await dispatch.example.asyncAddBy(5)

    expect(getStore().getState()).toEqual({
      example: 7,
    })
  })

  test('should be able to trigger another action w/ an object value', async () => {
    init()

    model({
      name: 'example',
      state: 3,
      reducers: {
        addBy: (state, payload) => state + payload.value,
      },
      effects: {
        asyncAddBy: async (value) => {
          await dispatch.example.addBy(value)
        }
      }
    })

    await dispatch.example.asyncAddBy({ value: 6 })

    expect(getStore().getState()).toEqual({
      example: 9,
    })
  })

  test('should be able to trigger another action w/ another action', async () => {
    init()

    model({
      name: 'example',
      state: 0,
      reducers: {
        addOne: (state) => state + 1,
      },
      effects: {
        asyncAddOne: async () => {
          await dispatch.example.addOne()
        },
        asyncCallAddOne: async () => {
          await dispatch.example.asyncAddOne()
        }
      }
    })

    await dispatch.example.asyncCallAddOne()

    expect(getStore().getState()).toEqual({
      example: 1,
    })
  })

  xtest('should be able to trigger another action w/ multiple actions', async () => {
    init()

    model({
      name: 'example',
      state: 0,
      reducers: {
        addBy: (state, payload) => state + payload,
      },
      effects: {
        asyncAddOne: async () => {
          await dispatch.example.addBy(1)
        },
        asyncAddThree: async () => {
          await dispatch.example.addBy(3)
        },
        asyncAddSome: async () => {
          await dispatch.example.asyncAddThree()
          await dispatch.example.asyncAddOne()
          await dispatch.example.asyncAddOne()
        }
      }
    })

    await dispatch.example.asyncAddSome()

    expect(getStore().getState()).toEqual({
      example: 5,
    })
  })
})