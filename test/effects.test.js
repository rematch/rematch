beforeEach(() => {
  jest.resetModules()
})

describe('effects:', () => {
  test('should create an action', () => {
    const { init, dispatch } = require('../src')

    const count = {
      state: 0,
      effects: {
        add: () => 1,
      },
    }

    init({
      models: { count }
    })

    expect(typeof dispatch.count.add).toBe('function')
  })
  test('first param should be payload', async () => {
    const { init } = require('../src')

    let value = 1

    const count = {
      state: 0,
      effects: {
        add(payload) {
          value += payload
        },
      },
    }

    const store = init({
      models: { count }
    })

    await store.dispatch({ type: 'count/add', payload: 4 })

    expect(value).toBe(5)
  })

  test('second param should contain state', async () => {
    const { init } = require('../src')

    const count = {
      state: 7,
      reducers: {
        add: (s, p) => s + p
      },
      effects: {
        makeCall(payload, state) {
          const { count } = state
          this.add(count + 1)
        },
      },
    }

    const store = init({
      models: { count }
    })

    await store.dispatch.count.makeCall(2)

    expect(store.getState().count).toBe(15)
  })

  // test('should create an effect', () => {
  //   const store = init()

  //   store.model({
  //     name: 'example',
  //     state: 0,
  //     effects: {
  //       add: () => 1
  //     },
  //   })

  //   expect(effects['example/add']()).toBe(1)
  // })

  test('should be able to trigger another action', async () => {
    const {
      init, dispatch
    } = require('../src')

    const example = {
      state: 0,
      reducers: {
        addOne: (state) => state + 1,
      },
      effects: {
        asyncAddOneArrow: async () => {
          await dispatch.example.addOne()
        }
      }
    }

    const store = init({
      models: { example }
    })

    await dispatch.example.asyncAddOneArrow()

    expect(store.getState()).toEqual({
      example: 1,
    })
  })

  // currently no solution for arrow functions as they are often transpiled by Babel or Typescript
  // there is no clear way to detect arrow functions
  // xtest('should be able trigger a local reducer using arrow functions and `this`', async () => {
  //   const { model, init, dispatch } = require('../src')
  //   const store = init()
  //
  //   model({
  //     name: 'example',
  //     state: 0,
  //     reducers: {
  //       addOne: (state) => state + 1,
  //     },
  //     effects: {
  //       asyncAddOneArrow: async () => {
  //         await this.addOne()
  //       }
  //     }
  //   })
  //
  //   await dispatch.example.asyncAddOneArrow()
  //
  //   expect(store.getState()).toEqual({
  //     example: 1,
  //   })
  // })

  test('should be able trigger a local reducer using functions and `this`', async () => {
    const {
      init, dispatch
    } = require('../src')

    const example = {
      state: 0,
      reducers: {
        addOne: (state) => state + 1,
      },
      effects: {
        asyncAddOne: async function () { // eslint-disable-line
          await this.addOne()
        }
      }
    }

    const store = init({
      models: { example }
    })

    await dispatch.example.asyncAddOne()

    expect(store.getState()).toEqual({
      example: 1,
    })
  })

  test('should be able trigger a local reducer using object function shorthand and `this`', async () => {
    const {
      init, dispatch
    } = require('../src')

    const example = {
      state: 0,
      reducers: {
        addOne: (state) => state + 1,
      },
      effects: {
        async asyncAddOne() {
          await this.addOne()
        }
      }
    }

    const store = init({
      models: { example }
    })

    await dispatch.example.asyncAddOne()

    expect(store.getState()).toEqual({
      example: 1,
    })
  })

  test('should be able to trigger another action with a value', async () => {
    const {
      init, dispatch
    } = require('../src')

    const example = {
      state: 2,
      reducers: {
        addBy: (state, payload) => state + payload,
      },
      effects: {
        asyncAddBy: async (value) => {
          await dispatch.example.addBy(value)
        }
      }
    }

    const store = init({
      models: { example }
    })

    await dispatch.example.asyncAddBy(5)

    expect(store.getState()).toEqual({
      example: 7,
    })
  })

  test('should be able to trigger another action w/ an object value', async () => {
    const {
      init, dispatch
    } = require('../src')
    
    const example = {
      state: 3,
      reducers: {
        addBy: (state, payload) => state + payload.value,
      },
      effects: {
        asyncAddBy: async (value) => {
          await dispatch.example.addBy(value)
        }
      }
    }

    const store = init({
      models: { example }
    })

    await dispatch.example.asyncAddBy({ value: 6 })

    expect(store.getState()).toEqual({
      example: 9,
    })
  })

  test('should be able to trigger another action w/ another action', async () => {
    const {
      init, dispatch
    } = require('../src')

    const example = {
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
    }

    const store = init({
      models: { example }
    })

    await dispatch.example.asyncCallAddOne()

    expect(store.getState()).toEqual({
      example: 1,
    })
  })

  test('should be able to trigger another action w/ multiple actions', async () => {
    const {
      init, dispatch
    } = require('../src')

    const example = {
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
    }

    const store = init({
      models: { example }
    })

    await dispatch.example.asyncAddSome()

    await setTimeout(() => {
      expect(store.getState()).toEqual({
        example: 5,
      })
    })
  })

  test('should throw if the effect name is invalid', () => {
    const {
      model, init
    } = require('../src')
    const store = init()

    expect(() => store.model({
      name: 'a',
      state: 42,
      effects: {
        'invalid/effect': () => 43,
      },
    })).toThrow()
  })

  test('should throw if the effect is not a function', () => {
    const {
      model, init
    } = require('../src')
    const store = init()

    expect(() => store.model({
      name: 'a',
      state: 42,
      effects: {
        is43: 43,
      },
    })).toThrow()
  })

  test('should appear as an action for devtools', async () => {
    const { init } = require('../src')

    let count = 0

    const store = init({
      models: {
        count: {
          state: 0,
          reducers: {
            addOne(state) {
              return state + 1
            }
          },
          effects: {
            addOneAsync() {
              this.addOne()
            }
          }
        }
      },
      redux: {
        middlewares: [() => next => action => {
          if (action.type === 'count/addOneAsync') {
            count += 1
          }
          return next(action)
        }]
      }
    })

    await Promise.all([
      store.dispatch.count.addOneAsync(),
      store.dispatch.count.addOneAsync()
    ])
    expect(count).toBe(2)
  })

  test('should not validate effect if production', () => {
    const { init } = require('../src')

      process.env.NODE_ENV = 'production'

      const count = {
        state: 0,
        effects: {
          'add/invalid': state => state + 1,
        },
      }

      expect(() => init({
        models: { count }
      })).not.toThrow()
  })
})
