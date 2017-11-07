beforeEach(() => {
  jest.resetModules()
})

describe('select:', () => {
  it('should create a valid list of selectors', () => {
    const { init, select } = require('../src')
    const a = {
      name: 'a',
      state: 0,
      reducers: {
        increment: s => s + 1
      },
      selectors: {
        double: s => s * 2
      },
    }
    init({
      models: { a }
    })
    expect(typeof select.a.double).toBe('function')
  })

  it('should allow access to the selector', () => {
    const {
      init, model, select, getStore
    } = require('../src')
    init()
    model({
      name: 'a',
      state: 2,
      reducers: {
        increment: s => s + 1
      },
      selectors: {
        double: s => s * 2
      },
    })
    const state = getStore().getState()
    const doubled = select.a.double(state)
    expect(doubled).toBe(4)
  })

  it('should allow passing in of params toselector', () => {
    const {
      init, model, select, getStore
    } = require('../src')
    init()
    model({
      name: 'a',
      state: 2,
      reducers: {
        increment: s => s + 1
      },
      selectors: {
        prependWithLetter: (s, letter) => letter + s
      },
    })
    const state = getStore().getState()
    const prepended = select.a.prependWithLetter(state, 'P')
    expect(prepended).toBe('P2')
  })

  test('should throw if selector is not a function', () => {
    const {
      init, model
    } = require('../src')
    init()
    expect(() => model({
      name: 'a',
      state: 2,
      selectors: {
        invalid: 42,
      },
    })).toThrow()
  })

  describe('reselect: ', () => {
    it('should allow for createSelector to be used instead of a normal selector', () => {
      const {
        init, model, select, getStore
      } = require('../src')
      const { createSelector } = require('reselect')
      init()
      model({
        name: 'count',
        state: 2,
        selectors: {
          double: createSelector(
            state => state,
            count => count * 2
          )
        },
      })
      const state = getStore().getState()
      const doubled = select.count.double(state)
      expect(doubled).toBe(4)
    })

    it('should allow createSelector to be used outside of a model', () => {
      const {
        init, model, select, getStore
      } = require('../src')
      const { createSelector } = require('reselect')
      init()
      model({
        name: 'countA',
        state: 2,
        selectors: {
          double: state => state * 2
        }
      })
      model({
        name: 'countB',
        state: 10,
        selectors: {
          double: state => state * 2
        }
      })

      const outsideSelector = createSelector(
        select.countA.double,
        select.countB.double,
        (countADoubled, countBDoubled) => countADoubled + countBDoubled
      )

      const state = getStore().getState()
      const result = outsideSelector(state)
      expect(result).toBe(24)
    })

    it('should allow for mixing normal selectors and reselect selectors', () => {
      const {
        init, model, select, getStore
      } = require('../src')
      const { createSelector } = require('reselect')
      init()
      model({
        name: 'countA',
        state: 2,
        selectors: {
          double: state => state * 2,
          plusOne: createSelector(
            state => state,
            countA => countA + 1
          )
        }
      })
      model({
        name: 'countB',
        state: 10,
        selectors: {
          double: createSelector(
            state => state,
            countB => countB * 2
          )
        }
      })

      const outsideSelector = createSelector(
        select.countA.double,
        select.countA.plusOne,
        select.countB.double,
        (countADoubled, countAPlusOne, countBDoubled) =>
          countADoubled + countAPlusOne + countBDoubled
      )

      const state = getStore().getState()
      const result = outsideSelector(state)
      expect(result).toBe(27)
    })
  })
})

