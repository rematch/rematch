// Type definitions for @rematch/select 3.0.0
// Definitions by: Sam Richard <https://github.com/d3dc>
import { Models, RematchRootState } from '@rematch/core'
import * as Reselect from 'reselect'

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

export type RematchSelect<M extends object = Models, RootState = any> = ((
	mapSelectToProps: (select: RematchSelect<M, RootState>) => object
) => Reselect.OutputParametricSelector<
	RootState,
	any,
	object,
	Reselect.Selector<RootState, object>
>) &
	StoreSelectors<RootState>

declare module '@rematch/core' {
	interface Model<
		TModels = Models,
		TState = any,
		TBaseState = TState,
		AllModelsKeys extends string = string
	> {
		selectors?: ModelSelectorsConfig<TState>
	}

	interface RematchStore<TModels> {
		select: RematchSelect<TModels, RematchRootState<TModels>>
	}
}
