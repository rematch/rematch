beforeEach(() => {
  jest.resetModules()
})

describe('select:', () => {
  it('should create a valid list of selectors', () => {
    const selectPlugin = require('../src').default
    const { select } = require('../src')
    const { init } = require('../../../build')
    const a = {
      state: 0,
      reducers: {
        increment: s => s + 1
      },
      selectors: {
        double: s => s * 2
      },
    }
    init({
      models: { a },
      plugins: [selectPlugin()]
    })
    expect(typeof select.a.double).toBe('function')
  })

  it('should allow access to the selector', () => {
    const selectPlugin = require('../src').default
    const { select } = require('../src')
    const { init, getStore } = require('../../../build')
    const a = {
      state: 2,
      reducers: {
        increment: s => s + 1
      },
      selectors: {
        double: s => s * 2
      },
    }
    init({
      models: { a },
      plugins: [selectPlugin()]
    })
    const state = getStore().getState()
    const doubled = select.a.double(state)
    expect(doubled).toBe(4)
  })

  it('should allow passing in of params toselector', () => {
    const selectPlugin = require('../src').default
    const { select } = require('../src')
    const { init, getStore } = require('../../../build')
    const a = {
      state: 2,
      reducers: {
        increment: s => s + 1
      },
      selectors: {
        prependWithLetter: (s, letter) => letter + s
      },
    }
    init({
      models: { a },
      plugins: [selectPlugin()]
    })
    const state = getStore().getState()
    const prepended = select.a.prependWithLetter(state, 'P')
    expect(prepended).toBe('P2')
  })

  test('should throw if selector is not a function', () => {
    const selectPlugin = require('../src').default
    const { init, model } = require('../../../build')
    init({
      plugins: [selectPlugin()]
    })
    expect(() => model({
      name: 'a',
      state: 2,
      selectors: {
        invalid: 42,
      },
    })).toThrow()
  })

  test('should not throw if no selectors', () => {
    const selectPlugin = require('../src').default
    const { init } = require('../../../build')
    const a = {
      state: 2,
      reducers: {
        increment: s => s + 1
      },
    }
    const start = () => init({
      models: { a },
      plugins: [selectPlugin()]
    })
    expect(start).not.toThrow()
  })

  describe('reselect: ', () => {
    it('should allow for createSelector to be used instead of a normal selector', () => {
      const selectPlugin = require('../src').default
      const { select } = require('../src')
      const { init, getStore } = require('../../../build')
      const { createSelector } = require('reselect')
      const count = {
        state: 2,
        selectors: {
          double: createSelector(
            state => state,
            c => c * 2
          )
        },
      }
      init({
        models: { count },
        plugins: [selectPlugin()]
      })
      const state = getStore().getState()
      const doubled = select.count.double(state)
      expect(doubled).toBe(4)
    })

    it('should allow createSelector to be used outside of a model', () => {
      const selectPlugin = require('../src').default
      const { select } = require('../src')
      const { init, getStore } = require('../../../build')
      const { createSelector } = require('reselect')
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
      init({
        models: { countA, countB },
        plugins: [selectPlugin()]
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
      const selectPlugin = require('../src').default
      const { select } = require('../src')
      const { init, getStore } = require('../../../build')
      const { createSelector } = require('reselect')
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

      init({
        models: { countA, countB },
        plugins: [selectPlugin()]
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

