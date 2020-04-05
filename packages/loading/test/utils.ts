/* eslint-disable import/no-extraneous-dependencies */
import { fromJS } from 'immutable'
import { combineReducers } from 'redux-immutable'
import { ExtractRematchDispatchersFromModel } from '@rematch/core'

export const delay = (ms: number): Promise<void> =>
	new Promise((r) => setTimeout(r, ms))

type CountModel = {
	state: number
	reducers: {
		addOne(s: number): number
	}
	effects: {
		timeout(): Promise<void>
	}
}

export const count: CountModel = {
	state: 0,
	reducers: {
		addOne: (s: number): number => s + 1,
	},
	effects: {
		async timeout(
			this: ExtractRematchDispatchersFromModel<CountModel>
		): Promise<void> {
			await delay(200)
			await this.addOne()
		},
	},
}

export const countModelMaker = (): CountModel => ({
	state: 0,
	reducers: {
		addOne: (s: number): number => s + 1,
	},
	effects: {
		async timeout(
			this: ExtractRematchDispatchersFromModel<CountModel>
		): Promise<void> {
			await delay(200)
			await this.addOne()
		},
	},
})

export const redux = {
	initialState: fromJS({}),
	combineReducers,
}

const immutableLoadingActionCreator = (
	state: any,
	name: any,
	action: any,
	converter: any,
	cntState: any
): any =>
	state
		.asImmutable()
		.withMutations((map: any) =>
			map
				.set('global', converter(cntState.global))
				.setIn(['models', name], converter(cntState.models[name]))
				.setIn(
					['effects', name, action],
					converter(cntState.effects[name][action])
				)
		)

const immutableMergeInitialState = (state: any, newObj: any): any =>
	state.asMutable().mergeDeep(fromJS(newObj))

export const loadingImmutableConfigMaker = ({ asNumber }: any): any => ({
	loadingActionCreator: immutableLoadingActionCreator,
	mergeInitialState: immutableMergeInitialState,
	model: {
		state: fromJS({}),
	},
	asNumber,
})
