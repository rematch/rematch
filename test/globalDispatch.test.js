const { init } = require('../src')

describe('globalDispatch:', () => {
  test('should run reducers', () => {
    const { dispatch } = require('../src')
    const store = init({
      models: {
        count: {
          state: 0,
          reducers: {
            addOne(state) {
              return state + 1
            }
          }
        }
      }
    })

    dispatch.count.addOne()
    dispatch.count.addOne()
    expect(store.getState().count).toBe(2)
  })

  test('should run multiple store reducers', () => {
    const { dispatch } = require('../src')
    const store1 = init({
      models: {
        count: {
          state: 0,
          reducers: {
            addOne(state) {
              return state + 1
            }
          }
        }
      }
    })
    const store2 = init({
      models: {
        count: {
          state: 0,
          reducers: {
            addOne(state) {
              return state + 1
            }
          }
        }
      }
    })
    

    dispatch.count.addOne()
    expect(store1.getState().count).toBe(1)
    expect(store2.getState().count).toBe(1)
  })

  test('should run effects', async () => {
    const { dispatch } = require('../src')
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
            async asyncAddOne() {
              await this.addOne()
            }
          }
        }
      }
    })

    await dispatch.count.asyncAddOne()
    expect(store.getState().count).toBe(1)
  })

  test('should run multiple store effects', async () => {
    const { dispatch } = require('../src')
    const store1 = init({
      models: {
        count: {
          state: 0,
          reducers: {
            addOne(state) {
              return state + 1
            }
          },
          effects: {
            async asyncAdd() {
              await this.addOne()
            }
          }
        }
      }
    })

    const store2 = init({
      models: {
        count: {
          state: 0,
          reducers: {
            addFive(state) {
              return state + 5
            }
          },
          effects: {
            async asyncAdd() {
              await this.addFive()
            }
          }
        }
      }
    })

    await dispatch.count.asyncAdd()
    expect(store1.getState().count).toBe(1)
    expect(store2.getState().count).toBe(5)
  })

  test('should run multiple store reducers/effects', async () => {
    const { dispatch } = require('../src')
    const store1 = init({
      models: {
        count: {
          state: 0,
          reducers: {
            add(state) {
              return state + 1
            }
          },
        }
      }
    })

    const store2 = init({
      models: {
        count: {
          state: 0,
          reducers: {
            addFive(state) {
              return state + 5
            }
          },
          effects: {
            async add() {
              await this.addFive()
            }
          }
        }
      }
    })

    await dispatch.count.add()
    expect(store1.getState().count).toBe(1)
    expect(store2.getState().count).toBe(5)
  })
})