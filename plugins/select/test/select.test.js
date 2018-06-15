const { createSelector } = require('reselect')
const { default: createSelectPlugin, SELECT_REF_KEY } = require('../src')
const { select } = require('../src')
const { init } = require('../../../src')

describe('select:', () => {
  it('should create a valid list of selectors', () => {
    const a = {
      state: 0,
      reducers: {
        increment: s => s + 1
      },
      selectors: {
        double: s => s * 2
      }
    }
    init({
      models: { a },
      plugins: [createSelectPlugin()]
    })
    expect(typeof select.a.double).toBe('function')
  })

  it('should allow access to the selector', () => {
    const a = {
      state: 2,
      reducers: {
        increment: s => s + 1
      },
      selectors: {
        double: s => s * 2
      }
    }
    const store = init({
      models: { a },
      plugins: [createSelectPlugin()]
    })
    const state = store.getState()
    const doubled = select.a.double(state)
    expect(doubled).toBe(4)
  })

  it('should allow passing in of params toselector', () => {
    const a = {
      state: 2,
      reducers: {
        increment: s => s + 1
      },
      selectors: {
        prependWithLetter: (s, letter) => letter + s
      }
    }
    const store = init({
      models: { a },
      plugins: [createSelectPlugin()]
    })
    const state = store.getState()
    const prepended = select.a.prependWithLetter(state, 'P')
    expect(prepended).toBe('P2')
  })

  test('should throw if selector is not a function', () => {
    const store = init({
      plugins: [createSelectPlugin()]
    })
    expect(() => store.model({
      name: 'a',
      state: 2,
      selectors: {
        invalid: 42
      }
    })).toThrow()
  })

  test('should not throw if no selectors', () => {
    const a = {
      state: 2,
      reducers: {
        increment: s => s + 1
      }
    }
    const start = () => init({
      models: { a },
      plugins: [createSelectPlugin()]
    })
    expect(start).not.toThrow()
  })

  describe('reselect: ', () => {
    it('should allow for createSelector to be used instead of a normal selector', () => {
      const count = {
        state: 2,
        selectors: {
          double: createSelector(
            state => state,
            c => c * 2
          )
        }
      }
      const store = init({
        models: { count },
        plugins: [createSelectPlugin()]
      })
      const state = store.getState()
      const doubled = select.count.double(state)
      expect(doubled).toBe(4)
    })

    it('should allow createSelector to be used outside of a model', () => {
      const countA = {
        state: 2,
        selectors: {
          double: state => state * 2
        }
      }
      const countB = {
        state: 10,
        selectors: {
          double: state => state * 2
        }
      }
      const store = init({
        models: { countA, countB },
        plugins: [createSelectPlugin()]
      })
      const outsideSelector = createSelector(
        select.countA.double,
        select.countB.double,
        (countADoubled, countBDoubled) => countADoubled + countBDoubled
      )

      const state = store.getState()
      const result = outsideSelector(state)
      expect(result).toBe(24)
    })

    it('should allow for mixing normal selectors and reselect selectors', () => {
      const countA = {
        state: 2,
        selectors: {
          double: state => state * 2,
          plusOne: createSelector(
            state => state,
            c => c + 1
          )
        }
      }
      const countB = {
        state: 10,
        selectors: {
          double: createSelector(
            state => state,
            c => c * 2
          )
        }
      }

      const store = init({
        models: { countA, countB },
        plugins: [createSelectPlugin()]
      })

      const outsideSelector = createSelector(
        select.countA.double,
        select.countA.plusOne,
        select.countB.double,
        (countADoubled, countAPlusOne, countBDoubled) =>
          countADoubled + countAPlusOne + countBDoubled
      )

      const state = store.getState()
      const result = outsideSelector(state)
      expect(result).toBe(27)
    })
  })

  describe('store ref: ', () => {
    it('should expose the store name', async () => {
      const store = init({
        plugins: [createSelectPlugin()]
      })

      const state = store.getState()
      expect(state).toEqual({
        [SELECT_REF_KEY]: store.name
      })
    })

    it('should expose the store name with a configured key', async () => {
      const store = init({
        plugins: [createSelectPlugin({
          name: 'chicken'
        })]
      })

      const state = store.getState()
      expect(state).toEqual({
        'chicken': store.name
      })
    })
  })

  describe('local select: ', () => {
    it('should allow access to the same model selectors', () => {
      const a = {
        state: 2,
        reducers: {
          increment: s => s + 1
        },
        selectors: {
          double: s => s * 2,
          quadruple (s) {
            return this.double() * 2
          }
        }
      }
      const store = init({
        models: { a },
        plugins: [createSelectPlugin()]
      })
      const state = store.getState()
      const doubled = select.a.double(state)
      const quadrupled = select.a.quadruple(state)
      expect(doubled).toBe(4)
      expect(quadrupled).toBe(8)
    })

    it('should allow access to store selectors', () => {
      const a = {
        state: 2,
        reducers: {
          increment: s => s + 1
        },
        selectors: (select) => ({
          double: s => s * 2,
          quadruple (s) {
            return select.a.double() * 2
          }
        })
      }
      const store = init({
        models: { a },
        plugins: [createSelectPlugin()]
      })
      const state = store.getState()
      const doubled = select.a.double(state)
      const quadrupled = select.a.quadruple(state)
      expect(doubled).toBe(4)
      expect(quadrupled).toBe(8)
    })

    it('should curry store state', () => {
      const a = {
        state: 2,
        reducers: {
          increment: s => s + 1
        },
        selectors: {
          double: s => s * 2,
          curriedDouble (s) {
            return this.double(42)
          }
        }
      }
      const store = init({
        models: { a },
        plugins: [createSelectPlugin()]
      })
      const state = store.getState()
      const doubled = select.a.curriedDouble(state)
      expect(doubled).toBe(4)
    })
  })

  describe('sliceState config: ', () => {
    test('should throw if sliceState config is not a function', () => {
      const createSelectPlugin = require('../src').default
      const { init } = require('../../../src')

      const start = () => {
        init({ plugins: [ createSelectPlugin({ sliceState: 'error' }) ] })
      }

      expect(start).toThrow()
    })

    it('should allow access to the global state with a property configured sliceState method', () => {
      const createSelectPlugin = require('../src').default
      const { select } = require('../src')
      const { init } = require('../../../src')

      const countA = {
        state: 2,
        selectors: {
          double: state => state.countB * 2
        }
      }
      const countB = {
        state: 10,
        selectors: {
          double: state => state.countA * 2
        }
      }

      const store = init({
        models: { countA, countB },
        plugins: [createSelectPlugin({ sliceState: (rootState) => rootState })]
      })

      const state = store.getState()
      const result = select.countB.double(state)
      expect(result).toBe(4)
    })
  })
})

