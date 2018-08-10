// Type definitions for @rematch/select 2.0.0
// Definitions by: Sam Richard <https://github.com/d3dc>
import * as R from '@rematch/core'
import * as Reselect from 'reselect'

export { createSelector, createStructuredSelector } from 'reselect'

export interface SelectConfig {
	sliceState?: any,
	selectorCreator?: any,
}

declare const createSelectPlugin: (config?: SelectConfig) => R.Plugin<R.Models, R.Action<any, any>>
export default createSelectPlugin

type Selector<S, P = any, R = any> =
	Reselect.Selector<S, R>
	& Reselect.ParametricSelector<S, P, R>

interface ModelSelectors<S> {
	[key: string]: Selector<S>
}

interface StoreSelectors<S> {
	[key: string]: ModelSelectors<S>
}

type SelectorFactory<S, P = any, R = any> =
	(this: ModelSelectors<S>, models: StoreSelectors<S>) => Selector<S, P, R>

type SelectorParametricFactory<S, P = any> =
	(this: ModelSelectors<S>, models: StoreSelectors<S>, props: P) => Selector<S>

type Slicer<S, M = any, R = any> =
	Selector<S, void, M>
	| (
			(resultFn: (slice: M) => R) =>
				Selector <S, void, R>
		)

type SelectorCreator =
	typeof Reselect.createSelector

type Parameterizer<S, P = any> =
	(factory: SelectorParametricFactory<S, P>) => SelectorFactory<P, void, Selector<S>>

interface ModelSelectorFactories<S> {
	[key: string]: SelectorFactory<S> | SelectorParametricFactory<S>
}

type ModelSelectorsFactory<S> =
	(
		slice: Slicer<S>,
		createSelector: SelectorCreator,
		hasProps: Parameterizer<S>
	) => ModelSelectorFactories<S>

type ModelSelectorsConfig<S> =
	ModelSelectorsFactory<S>
	| ModelSelectorFactories<S>

type RematchSelect<M extends R.Models | void = void, RootState = any> =
 (
	 (mapSelectToProps: (select: RematchSelect<M, RootState>) => object) =>
	 		Reselect.OutputParametricSelector<RootState, any, object, Reselect.Selector<RootState, object>>
 ) & StoreSelectors<RootState>

declare module '@rematch/core' {
	export interface ModelConfig<S = any, SS = S> {
		selectors?: ModelSelectorsConfig<S>,
	}

	export interface RematchStore<M extends Models = Models, A extends Action = Action> {
		select: RematchSelect<M>,
	}
}
