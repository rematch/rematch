/* eslint-disable no-shadow,@typescript-eslint/ban-ts-ignore */
import { init } from '@rematch/core'
import selectPlugin from '../src'

describe('select:', () => {
	test('should not throw if no selectors', () => {
		const a = {
			state: 2,
			reducers: {
				increment: (s: number): number => s + 1,
			},
		}

		const start = (): void => {
			init({
				models: { a },
				plugins: [selectPlugin()],
			})
		}

		expect(start).not.toThrow()
	})

	test('should throw if any selector is not a function or descriptor', () => {
		const store = init({
			plugins: [selectPlugin()],
		})

		expect(() =>
			store.addModel({
				name: 'a',
				state: 2,
				selectors: {
					// @ts-expect-error
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
					increment: (s: number): number => s + 1,
				},
				selectors: {
					double: () => (s: any): number => s.a * 2,
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
					increment: (s: number): number => s + 1,
				},
				selectors: {
					double: () => (s: any): number => s.a * 2,
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
					increment: (s: number): number => s + 1,
				},
				selectors: {
					prependWithLetter: () => (s: any, { letter }: any): any =>
						letter + s.a,
				},
			}

			const store = init({
				// @ts-ignore
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
				reducers: {},
				selectors: (_: any, createSelector: any): any => ({
					double: (): any =>
						createSelector(
							(state: any): any => state,
							(state: any): any => state.count * 2
						),
				}),
			}

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
				reducers: {},
				selectors: (slice: any, createSelector: any): any => ({
					double: (): any =>
						createSelector(slice, (c: number): number => c * 2),
				}),
			}

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
				reducers: {},
				selectors: (slice: any): any => ({
					double: (): any => slice((c: number): number => c * 2),
				}),
			}

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
				reducers: {},
				selectors: {
					double: () => (state: any): number => state.countA * 2,
				},
			}

			const combined = {
				state: 10,
				reducers: {},
				selectors: (slice: any, createSelector: any): any => ({
					double: (): any => slice((b: number): number => b * 2),
					value({ countA }: any): any {
						return createSelector(
							this.double,
							countA.double,
							(b: number, a: number): number => a + b
						)
					},
				}),
			}

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
					reducers: {},
					selectors: (
						slice: any,
						_createSelector: any,
						hasProps: any
					): any => ({
						prependWithLetter: hasProps((_: any, letter: number) =>
							slice((a: number): number => letter + a)
						),
					}),
				}

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
				reducers: {},
				selectors: (slice: any): any => ({
					double: () => (state: any): number => state.countA * 2,
					plusOne: (): any => slice((c: number): number => c + 1),
				}),
			}

			const countB = {
				state: 10,
				reducers: {},
				selectors: (slice: any, createSelector: any): any => ({
					double: (): any =>
						createSelector(slice, (c: number): number => c * 2),
				}),
			}
			const countC = {
				state: 0,
				reducers: {},
				selectors: (_: any, createSelector: any): any => ({
					calc: ({ countA, countB }: any): any =>
						createSelector(
							countA.double,
							countA.plusOne,
							countB.double,
							(
								countADoubled: number,
								countAPlusOne: number,
								countBDoubled: number
							): number => countADoubled + countAPlusOne + countBDoubled
						),
				}),
			}

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
				reducers: {},
				selectors: {
					double: () => (state: any): number => state.countA * 2,
				},
			}

			const countB = {
				state: 10,
				reducers: {},
				selectors: {
					double: () => (state: any): number => state.countB * 2,
				},
			}

			const store = init({
				models: { countA, countB },
				plugins: [selectPlugin()],
			})

			const state = store.getState()

			const selector = store.select((models) => ({
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
			const start = (): any => {
				init({ plugins: [selectPlugin({ selectorCreator: 'error' })] })
			}

			expect(start).toThrow()
		})
	})

	describe('sliceState config: ', () => {
		test('should throw if sliceState config is not a function', () => {
			const start = (): any => {
				init({ plugins: [selectPlugin({ sliceState: 'error' })] })
			}

			expect(start).toThrow()
		})

		it('should allow access to the global state with a property configured sliceState method', () => {
			const countA = {
				state: 2,
				reducers: {},
				selectors: (slice: any): any => ({
					double: (): any => slice((state: any): number => state.countB * 2),
				}),
			}

			const countB = {
				state: 10,
				reducers: {},
				selectors: (slice: any): any => ({
					double: (): any => slice((state: any): number => state.countA * 2),
				}),
			}

			const store = init({
				models: { countA, countB },
				plugins: [
					selectPlugin({ sliceState: (rootState: any): any => rootState }),
				],
			})

			const state = store.getState()

			const result = store.select.countB.double(state)
			expect(result).toBe(4)
		})
	})
})
