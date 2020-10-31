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
import { Store as ReduxStore, Reducer as ReduxReducer } from 'redux'

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
	((resultFn: (slice: S) => R) => Selector<S, void, R>)
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

export type RematchSelect<
	TModels extends Models<TModels>,
	RootState = Record<string, any>
> = ((
	mapSelectToProps: (
		select: RematchSelect<TModels, RootState>
	) => Record<string, any>
) => Reselect.OutputParametricSelector<
	RootState,
	any,
	Record<string, any>,
	Reselect.Selector<RootState, Record<string, any>>
>) &
	StoreSelectors<RootState>

declare module '@rematch/core' {
	// Add overloads for store to add select
	interface RematchStore<TModels extends Models<TModels> = Record<string, any>>
		extends ReduxStore<RematchRootState<TModels>, Action> {
		[index: string]: ExposedFunction | Record<string, any> | string
		name: string
		dispatch: RematchDispatch<TModels>
		select: RematchSelect<TModels, RematchRootState<TModels>>
		addModel: (model: NamedModel<TModels>) => void
	}

	// add overloads for Model here.
	interface Model<
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

	// add overloads for ModelCreator here.
	interface ModelCreator {
		<RM extends Models<RM>>(): <
			R extends ModelReducers<S>,
			BR extends ReduxReducer<BS>,
			E extends ModelEffects | ModelEffectsCreator<RM>,
			SE extends ModelSelectorsConfig<S>,
			S,
			BS = S
		>(mo: {
			name?: string
			state: S
			selectors?: SE
			reducers?: R
			baseReducer?: BR
			effects?: E
		}) => {
			name?: string
			state: S
			selectors?: SE
			reducers: R
			baseReducer: BR
			effects: E
		}
	}
}
