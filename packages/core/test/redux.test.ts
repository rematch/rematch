import { Dispatch } from 'redux'
import { init, Action } from '../src'

describe('redux:', () => {
	test('combineReducers should replace root', () => {
		const store = init({
			redux: {
				initialState: {},
				reducers: {
					a: (): number => 12,
					b: (): number => 27,
				},
				combineReducers: () => (): number => 42,
			},
		})

		expect(store.getState()).toBe(42)
	})

	test('should not accept invalid value as "redux.combineReducers"', () => {
		expect(() =>
			init({
				redux: {
					combineReducers: 42,
				},
			} as any)
		).toThrow()
	})

	test('combineReducers should replace root', () => {
		const store = init({
			redux: {
				initialState: {},
				createStore: (): any => ({
					getState: (): number => 42,
				}),
			},
		})

		expect(store.getState()).toBe(42)
	})

	test('model baseReducer should run', () => {
		const libAction = 'fromRedux'
		const libReducer = (state: any = {}, action: Action): any => {
			switch (action.type) {
				case libAction:
					return {
						...state,
						message: action.payload,
					}
				default:
					return state
			}
		}

		type ChickenModel = {
			state: {
				message: any
			}
			reducers: {}
			baseReducer: typeof libReducer
			effects(dispatch: any): {
				dinner(): void
			}
		}

		const store = init({
			models: {
				chicken: {
					state: {
						message: undefined,
					},
					reducers: {},
					baseReducer: libReducer,
					effects: (dispatch: Dispatch) => ({
						dinner(): void {
							dispatch({ type: libAction, payload: 'winner' })
						},
					}),
				} as ChickenModel,
			},
		})

		store.dispatch.chicken.dinner()
		expect(store.getState().chicken.message).toBe('winner')
	})

	test('should not accept invalid "model.baseReducer"', () => {
		expect(() =>
			init({
				name: 'test',
				models: {
					createStore: { baseReducer: 42 },
				},
			} as any)
		).toThrow()
	})

	test('should not accept invalid value as "redux.createStore"', () => {
		expect(() =>
			init({
				name: 'test',
				redux: {
					createStore: 42,
				},
			} as any)
		).toThrow()
	})
})
