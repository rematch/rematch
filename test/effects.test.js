const { createThisTypeNode } = require('typescript')
const { init } = require('../src')

describe('effects:', () => {
	test('should create an action', () => {
		const count = {
			state: 0,
			effects: {
				add: () => 1,
			},
		}

		const store = init({
			models: { count },
		})

		expect(typeof store.dispatch.count.add).toBe('function')
	})
	test('first param should be payload', async () => {
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
			models: { count },
		})

		await store.dispatch({ type: 'count/add', payload: 4 })

		expect(value).toBe(5)
	})

	test('second param should contain state', async () => {
		let secondParam

		const count = {
			state: 7,
			reducers: {
				add: (s, p) => s + p,
			},
			effects: {
				async makeCall(payload, state) {
					secondParam = state
				},
			},
		}

		const store = init({
			models: { count },
		})

		await store.dispatch.count.makeCall(2)

		expect(secondParam).toEqual({ count: 7 })
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
		const example = {
			state: 0,
			reducers: {
				addOne: state => state + 1,
			},
			effects: {
				async asyncAddOneArrow() {
					await this.addOne()
				},
			},
		}

		const store = init({
			models: { example },
		})

		await store.dispatch.example.asyncAddOneArrow()

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
		const example = {
			state: 0,
			reducers: {
				addOne: state => state + 1,
			},
			effects: {
				async asyncAddOne() {
					await this.addOne()
				},
			},
		}

		const store = init({
			models: { example },
		})

		await store.dispatch.example.asyncAddOne()

		expect(store.getState()).toEqual({
			example: 1,
		})
	})

	test('should be able trigger a local reducer using object function shorthand and `this`', async () => {
		const example = {
			state: 0,
			reducers: {
				addOne: state => state + 1,
			},
			effects: {
				async asyncAddOne() {
					await this.addOne()
				},
			},
		}

		const store = init({
			models: { example },
		})

		await store.dispatch.example.asyncAddOne()

		expect(store.getState()).toEqual({
			example: 1,
		})
	})

	test('should be able to trigger another action with a value', async () => {
		const example = {
			state: 2,
			reducers: {
				addBy: (state, payload) => state + payload,
			},
			effects: {
				async asyncAddBy(value) {
					await this.addBy(value)
				},
			},
		}

		const store = init({
			models: { example },
		})

		await store.dispatch.example.asyncAddBy(5)

		expect(store.getState()).toEqual({
			example: 7,
		})
	})

	test('should be able to trigger another action w/ an object value', async () => {
		const example = {
			state: 3,
			reducers: {
				addBy: (state, payload) => state + payload.value,
			},
			effects: {
				async asyncAddBy(value) {
					await this.addBy(value)
				},
			},
		}

		const store = init({
			models: { example },
		})

		await store.dispatch.example.asyncAddBy({ value: 6 })

		expect(store.getState()).toEqual({
			example: 9,
		})
	})

	test('should be able to trigger another action w/ another action', async () => {
		const example = {
			name: 'example',
			state: 0,
			reducers: {
				addOne: state => state + 1,
			},
			effects: {
				async asyncAddOne() {
					await this.addOne()
				},
				async asyncCallAddOne() {
					await this.asyncAddOne()
				},
			},
		}

		const store = init({
			models: { example },
		})

		await store.dispatch.example.asyncCallAddOne()

		expect(store.getState()).toEqual({
			example: 1,
		})
	})

	test('should be able to trigger another action w/ multiple actions', async () => {
		const example = {
			state: 0,
			reducers: {
				addBy: (state, payload) => state + payload,
			},
			effects: {
				async asyncAddOne() {
					await this.addBy(1)
				},
				async asyncAddThree() {
					await this.addBy(3)
				},
				async asyncAddSome() {
					await this.asyncAddThree()
					await this.asyncAddOne()
					await this.asyncAddOne()
				},
			},
		}

		const store = init({
			models: { example },
		})

		await store.dispatch.example.asyncAddSome()

		await setTimeout(() => {
			expect(store.getState()).toEqual({
				example: 5,
			})
		})
	})

	test('should throw if the effect name is invalid', () => {
		const store = init()

		expect(() =>
			store.model({
				name: 'a',
				state: 42,
				effects: {
					'invalid/effect': () => 43,
				},
			})
		).toThrow()
	})

	test('should throw if the effect is not a function', () => {
		const store = init()

		expect(() =>
			store.model({
				name: 'a',
				state: 42,
				effects: {
					is43: 43,
				},
			})
		).toThrow()
	})

	test('should appear as an action for devtools', async () => {
		const actions = []

		const store = init({
			models: {
				count: {
					state: 0,
					reducers: {
						addOne(state) {
							return state + 1
						},
					},
					effects: {
						addOneAsync() {
							this.addOne()
						},
					},
				},
			},
			redux: {
				middlewares: [
					() => next => action => {
						actions.push(action.type)
						return next(action)
					},
				],
			},
		})

		await store.dispatch.count.addOneAsync()
		expect(actions).toEqual(['count/addOneAsync', 'count/addOne'])
	})

	test('should not validate effect if production', () => {
		process.env.NODE_ENV = 'production'

		const count = {
			state: 0,
			effects: {
				'add/invalid': state => state + 1,
			},
		}

		expect(() =>
			init({
				models: { count },
			})
		).not.toThrow()
	})

	describe('effects as a function', () => {
		it('should pass dispatch in as a function', async () => {
			const example = {
				state: 0,
				reducers: {
					addOne: state => state + 1,
				},
				effects: dispatch => ({
					async asyncAddOneArrow() {
						await dispatch.example.addOne()
					},
				}),
			}

			const store = init({
				models: { example },
			})

			await store.dispatch.example.asyncAddOneArrow()

			expect(store.getState()).toEqual({
				example: 1,
			})
		})

		it('should pass getState in as a function', async () => {
			const example = {
				state: 0,
				reducers: {
					addOne: state => state + 1,
				},
				effects: (dispatch, getState) => ({
					async asyncAddOneArrow() {
						console.log(getState)
						expect(getState()).toEqual({
							example: 0,
						})
						await dispatch.example.addOne()
						
						expect(getState()).toEqual({
							example: 1,
						})
					},
				}),
			}

			const store = init({
				models: { example },
			})

			await store.dispatch.example.asyncAddOneArrow()
		})
	})
})
