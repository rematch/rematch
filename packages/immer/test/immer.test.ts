import { init, Models } from '@rematch/core'
import immerPlugin from '../src'

describe('immer', () => {
	test('should load the immer plugin with a basic literal', () => {
		const count = {
			state: 0,
			reducers: {
				add(state: number): number {
					state += 1
					return state
				},
			},
		}

		const store = init({
			plugins: [immerPlugin()],
			models: { count },
		})

		store.dispatch({ type: 'count/add' })

		expect(store.getState()).toEqual({
			count: 1,
		})
	})

	test('should load the immer plugin with a object condition', () => {
		const todo = {
			state: [
				{
					todo: 'Learn typescript',
					done: true,
				},
				{
					todo: 'Try immer',
					done: false,
				},
			],
			reducers: {
				done(state: any): any {
					state.push({ todo: 'Tweet about it' })
					state[1].done = true
					return state
				},
			},
		}

		interface RootModel extends Models<RootModel> {
			todo: typeof todo
		}

		const store = init<RootModel>({
			plugins: [immerPlugin()],
			models: { todo },
		})
		store.dispatch({ type: 'todo/done' })
		const newState = store.getState().todo

		expect(todo.state.length).toBe(2)
		expect(newState).toHaveLength(3)

		expect(todo.state[1].done).toBe(false)
		expect(newState[1].done).toEqual(true)
	})

	describe('whitelist/blacklist', () => {
		let todo1: any
		let todo2: any

		beforeEach(() => {
			todo1 = {
				state: [
					{
						todo: 'Learn typescript',
						done: true,
					},
				],
				reducers: {
					add(state: any, newTodo: any): any {
						state.push(newTodo)
						return state
					},
				},
			}

			todo2 = {
				state: [
					{
						todo: 'Learn typescript',
						done: true,
					},
				],
				reducers: {
					add(state: any, newTodo: any): any {
						state.push(newTodo)
						return state
					},
				},
			}
		})

		test('should load the immer plugin on whitelisted model', () => {
			const store = init({
				plugins: [
					immerPlugin({
						whitelist: ['todo1'],
					}),
				],
				models: { todo1, todo2 },
			})

			const state = store.getState()

			store.dispatch.todo1.add({ todo: 'Tweet about it', done: false })
			expect(store.getState().todo1).not.toEqual(state.todo1)

			store.dispatch.todo2.add({ todo: 'Tweet about it', done: false })
			expect(store.getState().todo2).toEqual(state.todo2)
		})

		test('should not load the immer plugin on blacklisted model', () => {
			const store = init({
				plugins: [
					immerPlugin({
						blacklist: ['todo2'],
					}),
				],
				models: { todo1, todo2 },
			})

			const state = store.getState()

			store.dispatch.todo1.add({ todo: 'Tweet about it', done: false })
			expect(store.getState().todo1).not.toEqual(state.todo1)

			store.dispatch.todo2.add({ todo: 'Tweet about it', done: false })
			expect(store.getState().todo2).toEqual(state.todo2)
		})
	})
})
