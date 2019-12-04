/* eslint-disable import/no-extraneous-dependencies,@typescript-eslint/ban-ts-ignore,@typescript-eslint/explicit-function-return-type */
import { fromJS } from 'immutable'
import { combineReducers } from 'redux-immutable'

export const delay = ms => new Promise(r => setTimeout(r, ms))

export const count = {
	state: 0,
	reducers: {
		addOne: s => s + 1,
	},
	effects: {
		async timeout() {
			await delay(200)
			// @ts-ignore
			await this.addOne()
		},
	},
}

export const countModelMaker = () => ({
	state: 0,
	reducers: {
		addOne: s => s + 1,
	},
	effects: {
		async timeout() {
			await delay(200)
			// @ts-ignore
			await this.addOne()
		},
	},
})

export const redux = {
	initialState: fromJS({}),
	combineReducers,
}

const immutableLoadingActionCreator = (
	state,
	name,
	action,
	converter,
	cntState
) =>
	state.asImmutable().withMutations(map =>
		map
			.set('global', converter(cntState.global))
			.setIn(['models', name], converter(cntState.models[name]))
			.setIn(
				['effects', name, action],
				converter(cntState.effects[name][action])
			)
	)

const immutableMergeInitialState = (state, newObj) =>
	state.asMutable().mergeDeep(fromJS(newObj))

export const loadingImmutableConfigMaker = ({ asNumber }) => ({
	loadingActionCreator: immutableLoadingActionCreator,
	mergeInitialState: immutableMergeInitialState,
	model: {
		state: fromJS({}),
	},
	asNumber,
})
