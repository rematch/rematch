/* eslint no-underscore-dangle: 0 */
import { combineReducers, Reducer, ReducersMapObject } from 'redux'
import {
	Action,
	ConfigRedux,
	EnhancedReducers,
	Model,
	Reducers,
	RootReducers,
} from '../../typings/rematch'
import isListener from '../utils/isListener'

let combine = combineReducers

let allReducers: Reducers = {}

// create reducer for given dispatch type
// pass in (state, payload)
export const createReducer = (reducer: EnhancedReducers, initialState: any) => (
	state: any = initialState,
	action: Action
) => {
	// handle effects
	if (typeof reducer[action.type] === 'function') {
		return reducer[action.type](state, action.payload, action.meta)
	}
	return state
}

// creates a reducer out of "reducers" keys and values
export const createModelReducer = ({ name, reducers, state }: Model) => {
	const upperCaseFirst = (str: String) => {
		const [first, ...rest] = Array.from(str)
		return `${first.toUpperCase()}${rest.join('')}`
	}

	const modelReducers: Reducers = {}
	Object.keys(state || {}).forEach(key => {
		const reducerName = `set${upperCaseFirst(key)}`
		const defaultReducer = (state, payload) => ({ ...state, [key]: payload })
		modelReducers[reducerName] = defaultReducer
	})
	Object.keys(reducers || {}).forEach(reducer => {
		const action = isListener(reducer) ? reducer : `${name}/${reducer}`
		modelReducers[action] = reducers[reducer]
	})
	return {
		[name]: createReducer(modelReducers, state),
	}
}

// uses combineReducers to merge new reducers into existing reducers
export const mergeReducers = (nextReducers: Reducers = {}) => {
	allReducers = { ...allReducers, ...nextReducers }
	if (!Object.keys(allReducers).length) {
		return (state: any) => state
	}
	return combine(allReducers)
}

export const initReducers = (models: Model[], redux: ConfigRedux): void => {
	// optionally overwrite combineReducers on init
	combine = redux.combineReducers || combine

	// combine existing reducers, redux.reducers & model.reducers
	mergeReducers(
		models.reduce(
			(reducers, model) => ({
				...createModelReducer(model),
				...reducers,
			}),
			redux.reducers
		)
	)
}

export const createRootReducer = (
	rootReducers: RootReducers = {}
): Reducer<any> => {
	const mergedReducers: Reducer<any> = mergeReducers()
	if (Object.keys(rootReducers).length) {
		return (state, action) => {
			const rootReducerAction = rootReducers[action.type]
			if (rootReducers[action.type]) {
				return mergedReducers(rootReducerAction(state, action), action)
			}
			return mergedReducers(state, action)
		}
	}
	return mergedReducers
}
