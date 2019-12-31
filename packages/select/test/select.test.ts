/* eslint-disable @typescript-eslint/ban-ts-ignore,no-shadow */
import { init } from '@rematch/core'
import selectPlugin from '../src'

describe('select:', () => {
  test('should not throw if no selectors', () => {
    const a = {
      state: 2,
      reducers: {
        increment: s => s + 1,
      },
    }
    const start = () =>
      init({
        models: { a },
        plugins: [selectPlugin()],
      })
    expect(start).not.toThrow()
  })

  test('should throw if any selector is not a function or descriptor', () => {
    const store = init({
      plugins: [selectPlugin()],
    })
    expect(() =>
      store.model({
        name: 'a',
        state: 2,
        // @ts-ignore
        selectors: {
          invalid: 42,
        },
      })
    ).toThrow()
  })

  describe('externally created:', () => {
    it('should register a function', () => {
      const a = {
        state: 0,
        reducers: {
          increment: s => s + 1,
        },
        selectors: {
          double: () => s => s.a * 2,
        },
      }
      const store = init({
        models: { a },
        plugins: [selectPlugin()],
      })
      expect(typeof store.select.a.double).toBe('function')
    })

    it('should allow access to a function', () => {
      const a = {
        state: 2,
        reducers: {
          increment: s => s + 1,
        },
        selectors: {
          double: () => s => s.a * 2,
        },
      }
      const store = init({
        models: { a },
        plugins: [selectPlugin()],
      })
      const state = store.getState()
      const doubled = store.select.a.double(state)
      expect(doubled).toBe(4)
    })

    it('should allow passing in of params to a function', () => {
      const a = {
        state: 2,
        reducers: {
          increment: s => s + 1,
        },
        selectors: {
          prependWithLetter: () => (s, { letter }) => letter + s.a,
        },
      }
      // @ts-ignore
      const store = init({
        models: { a },
        plugins: [selectPlugin()],
      })
      const state = store.getState()
      const prepended = store.select.a.prependWithLetter(state, {
        letter: 'P',
      })
      expect(prepended).toBe('P2')
    })
  })

  describe('internally created: ', () => {
    it('should create a selector', () => {
      const count = {
        state: 2,
        selectors: (_slice, createSelector) => ({
          double: () =>
            createSelector(
              state => state,
              state => state.count * 2
            ),
        }),
      }
      // @ts-ignore
      const store = init({
        models: { count },
        plugins: [selectPlugin()],
      })
      const state = store.getState()
      const doubled = store.select.count.double(state)
      expect(doubled).toBe(4)
    })

    it('should create a selector for slice', () => {
      const count = {
        state: 2,
        selectors: (slice, createSelector) => ({
          double: () => createSelector(slice, c => c * 2),
        }),
      }
      // @ts-ignore
      const store = init({
        models: { count },
        plugins: [selectPlugin()],
      })
      const state = store.getState()
      const doubled = store.select.count.double(state)
      expect(doubled).toBe(4)
    })

    it('should allow for slice shorthand', () => {
      const count = {
        state: 2,
        selectors: slice => ({
          double: () => slice(c => c * 2),
        }),
      }
      // @ts-ignore
      const store = init({
        models: { count },
        plugins: [selectPlugin()],
      })
      const state = store.getState()
      const doubled = store.select.count.double(state)
      expect(doubled).toBe(4)
    })

    it('create a selector with dependencies', () => {
      const countA = {
        state: 2,
        selectors: {
          double: () => state => state.countA * 2,
        },
      }
      const combined = {
        state: 10,
        selectors: (slice, createSelector) => ({
          double: () => slice(b => b * 2),
          value({ countA }) {
            return createSelector(this.double, countA.double, (b, a) => a + b)
          },
        }),
      }
      // @ts-ignore
      const store = init({
        models: { countA, combined },
        plugins: [selectPlugin()],
      })
      const state = store.getState()
      const result = store.select.combined.value(state)
      expect(result).toBe(24)
    })

    describe('creating selectors with hasProps factory: ', () => {
      it('should create a selector with hasProps factory', () => {
        const a = {
          state: 2,
          selectors: (slice, _createSelector, hasProps) => ({
            prependWithLetter: hasProps((_models, letter) =>
              slice(a => letter + a)
            ),
          }),
        }
        // @ts-ignore
        const store = init({
          models: { a },
          plugins: [selectPlugin()],
        })
        const state = store.getState()
        // @ts-ignore
        const prepended = store.select.a.prependWithLetter('P')(state)
        expect(prepended).toBe('P2')
      })
    })

    it('should allow for mixing external and internal selectors', () => {
      const countA = {
        state: 2,
        // @ts-ignore
        selectors: slice => ({
          double: () => state => state.countA * 2,
          plusOne: () => slice(c => c + 1),
        }),
      }
      const countB = {
        state: 10,
        selectors: (slice, createSelector) => ({
          double: () => createSelector(slice, c => c * 2),
        }),
      }
      const countC = {
        state: 0,
        selectors: (_slice, createSelector) => ({
          calc: ({ countA, countB }) =>
            createSelector(
              countA.double,
              countA.plusOne,
              countB.double,
              (countADoubled, countAPlusOne, countBDoubled) =>
                countADoubled + countAPlusOne + countBDoubled
            ),
        }),
      }

      // @ts-ignore
      const store = init({
        models: { countA, countB, countC },
        plugins: [selectPlugin()],
      })

      const state = store.getState()
      const result = store.select.countC.calc(state)
      expect(result).toBe(27)
    })
  })

  describe('select function: ', () => {
    it('should create structural selector', () => {
      const countA = {
        state: 2,
        selectors: {
          double: () => state => state.countA * 2,
        },
      }
      const countB = {
        state: 10,
        selectors: {
          double: () => state => state.countB * 2,
        },
      }
      // @ts-ignore
      const store = init({
        models: { countA, countB },
        plugins: [selectPlugin()],
      })

      const state = store.getState()
      const selector = store.select(models => ({
        a: models.countA.double,
        b: models.countB.double,
      }))
      // @ts-ignore
      const result = selector(state)
      expect(result).toEqual({ a: 4, b: 20 })
    })
  })

  describe('selectorCreator config: ', () => {
    test('should throw if selectorCreator config is not a function', () => {
      const start = () => {
        init({ plugins: [selectPlugin({ selectorCreator: 'error' })] })
      }

      expect(start).toThrow()
    })
  })

  describe('sliceState config: ', () => {
    test('should throw if sliceState config is not a function', () => {
      const start = () => {
        init({ plugins: [selectPlugin({ sliceState: 'error' })] })
      }

      expect(start).toThrow()
    })

    it('should allow access to the global state with a property configured sliceState method', () => {
      const countA = {
        state: 2,
        selectors: slice => ({
          double: () => slice(state => state.countB * 2),
        }),
      }
      const countB = {
        state: 10,
        selectors: slice => ({
          double: () => slice(state => state.countA * 2),
        }),
      }

      // @ts-ignore
      const store = init({
        models: { countA, countB },
        plugins: [selectPlugin({ sliceState: rootState => rootState })],
      })

      const state = store.getState()
      const result = store.select.countB.double(state)
      expect(result).toBe(4)
    })
  })
})
