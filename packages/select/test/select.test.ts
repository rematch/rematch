import { createModel, init, Models, RematchRootState } from '@rematch/core'
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
			const a = createModel<RootModel>()({
				state: 0,
				reducers: {
					increment: (s) => s + 1,
				},
				selectors: {
					double: () => (s: any): number => s.a * 2,
				},
			})

			interface RootModel extends Models<RootModel> {
				a: typeof a
			}

			const models: RootModel = { a }

			const store = init<RootModel>({
				models,
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

			type RootModel = {
				a: typeof a
			}

			const store = init<RootModel>({
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

			type RootModel = {
				a: typeof a
			}

			const store = init<RootModel>({
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
			const count = createModel<RootModel>()({
				state: 2,
				reducers: {},
				selectors: (_, createSelector) => ({
					double: () =>
						createSelector(
							(
								state: RematchRootState<RootModel>
							): RematchRootState<RootModel> => state,
							(state): number => state.count * 2
						),
				}),
			})

			interface RootModel extends Models<RootModel> {
				count: typeof count
			}

			const store = init<RootModel>({
				models: { count },
				plugins: [selectPlugin()],
			})

			const state = store.getState()
			const doubled = store.select.count.double(state)
			expect(doubled).toBe(4)
		})

		it('should create a selector for slice', () => {
			const count = createModel<RootModel>()({
				state: 2,
				reducers: {},
				selectors: (slice, createSelector) => ({
					double: () => createSelector(slice, (c) => c * 2),
				}),
			})

			interface RootModel extends Models<RootModel> {
				count: typeof count
			}

			const store = init<RootModel>({
				models: { count },
				plugins: [selectPlugin()],
			})

			const state = store.getState()

			const doubled = store.select.count.double(state)
			expect(doubled).toBe(4)
		})

		it('should allow for slice shorthand', () => {
			const count = createModel<RootModel>()({
				state: 2,
				reducers: {},
				selectors: (slice) => ({
					double: () => slice((c) => c * 2),
				}),
			})

			const store = init<RootModel>({
				models: { count },
				plugins: [selectPlugin()],
			})

			interface RootModel extends Models<RootModel> {
				count: typeof count
			}

			const state = store.getState()

			const doubled = store.select.count.double(state)
			expect(doubled).toBe(4)
		})

		it('create a selector with dependencies', () => {
			const countA = createModel<RootModel>()({
				state: 2,
				reducers: {},
				selectors: {
					double: () => (state: any) => state.countA * 2,
				},
			})

			const combined = createModel<RootModel>()({
				state: 10,
				reducers: {},
				selectors: (slice, createSelector) => ({
					double: () => slice((b) => b * 2),
					value({ countA }: any) {
						return createSelector(
							this.double,
							countA.double,
							(b, a: any) => a + b
						)
					},
				}),
			})

			interface RootModel extends Models<RootModel> {
				countA: typeof countA
				combined: typeof combined
			}

			const store = init<RootModel>({
				models: { countA, combined },
				plugins: [selectPlugin()],
			})

			const state = store.getState()

			const result = store.select.combined.value(state)
			expect(result).toBe(24)
		})

		describe('creating selectors with hasProps factory: ', () => {
			it('should create a selector with hasProps factory', () => {
				const a = createModel<RootModel>()({
					state: 2,
					reducers: {},
					selectors: (slice, _createSelector, hasProps) => ({
						prependWithLetter: hasProps((_, letter) =>
							slice((a) => letter + a)
						),
					}),
				})

				const store = init<RootModel>({
					models: { a },
					plugins: [selectPlugin()],
				})

				interface RootModel extends Models<RootModel> {
					a: typeof a
				}

				const state = store.getState()

				const prepended = store.select.a.prependWithLetter('P')(state)
				expect(prepended).toBe('P2')
			})
		})

		it('should allow for mixing external and internal selectors', () => {
			const countA = createModel<RootModel>()({
				state: 2,
				reducers: {},
				selectors: (slice) => ({
					double: () => (state: any) => state.countA * 2,
					plusOne: () => slice((c) => c + 1),
				}),
			})

			const countB = createModel<RootModel>()({
				state: 10,
				reducers: {},
				selectors: (slice, createSelector) => ({
					double: () => createSelector(slice, (c) => c * 2),
				}),
			})

			const countC = createModel<RootModel>()({
				state: 0,
				reducers: {},
				selectors: (_, createSelector) => ({
					calc: ({ countA, countB }: any) =>
						createSelector(
							countA.double,
							countA.plusOne,
							countB.double,
							(
								countADoubled: number,
								countAPlusOne: number,
								countBDoubled: number
							) => countADoubled + countAPlusOne + countBDoubled
						),
				}),
			})

			interface RootModel extends Models<RootModel> {
				countA: typeof countA
				countB: typeof countB
				countC: typeof countC
			}

			const store = init<RootModel>({
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
			const countA = createModel<RootModel>()({
				state: 2,
				reducers: {},
				selectors: {
					double: () => (state: any) => state.countA * 2,
				},
			})

			const countB = createModel<RootModel>()({
				state: 10,
				reducers: {},
				selectors: {
					double: () => (state: any) => state.countB * 2,
				},
			})

			interface RootModel extends Models<RootModel> {
				countA: typeof countA
				countB: typeof countB
			}

			const store = init<RootModel>({
				models: { countA, countB },
				plugins: [selectPlugin()],
			})

			const state = store.getState()

			const selector = store.select((models) => ({
				a: models.countA.double,
				b: models.countB.double,
			}))

			const result: { a: number; b: number } = selector(state, undefined)
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
			const start = () => {
				// @ts-expect-error
				init({ plugins: [selectPlugin({ sliceState: 'error' })] })
			}

			expect(start).toThrow()
		})

		it('should allow access to the global state with a property configured sliceState method', () => {
			const countA = createModel<RootModel>()({
				state: 2,
				reducers: {},
				selectors: (slice) => ({
					double: () => slice((state: any) => state.countB * 2),
				}),
			})

			const countB = createModel<RootModel>()({
				state: 10,
				reducers: {},
				selectors: (slice) => ({
					double: () => slice((state: any) => state.countA * 2),
				}),
			})

			interface RootModel extends Models<RootModel> {
				countA: typeof countA
				countB: typeof countB
			}

			const store = init<RootModel>({
				models: { countA, countB },
				plugins: [selectPlugin({ sliceState: (rootState) => rootState })],
			})

			const state = store.getState()

			const result = store.select.countB.double(state)
			expect(result).toBe(4)
		})
	})
})
