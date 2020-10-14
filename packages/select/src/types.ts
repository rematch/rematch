// Type definitions for @rematch/select 3.0.0
// Definitions by: Sam Richard <https://github.com/d3dc>
import {
	Action,
	ExposedFunction,
	ModelEffects,
	ModelEffectsCreator,
	ModelReducers,
	Models,
	NamedModel,
	RematchDispatch,
	RematchRootState,
} from '@rematch/core'
import * as Reselect from 'reselect'
import { Reducer as ReduxReducer, Store as ReduxStore } from 'redux'

export { createSelector, createStructuredSelector } from 'reselect'

export interface SelectConfig {
	sliceState?: any
	selectorCreator?: any
}

export type Selector<S, P = any, R = any> = Reselect.Selector<S, R> &
	Reselect.ParametricSelector<S, P, R>

export interface ModelSelectors<S> {
	[key: string]: Selector<S>
}

export interface StoreSelectors<S> {
	[key: string]: ModelSelectors<S>
}

export type SelectorFactory<S, P = any, R = any> = (
	this: ModelSelectors<S>,
	models: StoreSelectors<S>
) => Selector<S, P, R>

export type SelectorParametricFactory<S, P = any> = (
	this: ModelSelectors<S>,
	models: StoreSelectors<S>,
	props: P
) => Selector<S>

export type Slicer<S, M = any, R = any> = Selector<S, void, M> &
	((resultFn: (slice: M) => R) => Selector<S, void, R>)

export type SelectorCreator = typeof Reselect.createSelector

export type Parameterizer<S, P = any> = (
	factory: SelectorParametricFactory<S, P>
) => SelectorFactory<P, void, Selector<S>>

export interface ModelSelectorFactories<S> {
	[key: string]: SelectorFactory<S> | SelectorParametricFactory<S>
}

export type ModelSelectorsFactory<S> = (
	slice: Slicer<S>,
	createSelector: SelectorCreator,
	hasProps: Parameterizer<S>
) => ModelSelectorFactories<S>

export type ModelSelectorsConfig<S> =
	| ModelSelectorsFactory<S>
	| ModelSelectorFactories<S>

export type RematchSelect<TModels extends Models<TModels>, RootState = any> = ((
	mapSelectToProps: (select: RematchSelect<TModels, RootState>) => object
) => Reselect.OutputParametricSelector<
	RootState,
	any,
	object,
	Reselect.Selector<RootState, object>
>) &
	StoreSelectors<RootState>

declare module '@rematch/core' {
	export interface Model<
		TModels extends Models<TModels> = Record<string, any>,
		TState = any,
		TBaseState = TState
	> {
		name?: string
		state: TState
		selectors?: ModelSelectorsConfig<TState>
		reducers?: ModelReducers<TState>
		baseReducer?: ReduxReducer<TBaseState>
		effects?: ModelEffects<TModels> | ModelEffectsCreator<TModels>
	}

	export interface ModelResult<S, R, BR, E> {
		name?: string
		state: S
		reducers?: R
		selectors?: ModelSelectorsConfig<S>
		baseReducer?: BR
		effects?: E
	}

	export interface RematchStore<
		TModels extends Models<TModels> = Record<string, any>
	> extends ReduxStore<RematchRootState<TModels>, Action> {
		[index: string]: ExposedFunction | Record<string, any> | string
		name: string
		dispatch: RematchDispatch<TModels>
		addModel: (model: NamedModel<TModels>) => void
	}
}
