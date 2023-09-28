// Type definitions for @rematch/select 2.0.0
// Definitions by: Sam Richard <https://github.com/d3dc>
import {
	ExtractRematchStateFromModels,
	Models,
	Model,
	Action,
	RematchRootState,
	ModelReducers,
	ModelEffects,
	ModelEffectsCreator,
} from '@rematch/core'
import * as Reselect from 'reselect'
import { Store as ReduxStore, Reducer as ReduxReducer } from 'redux'

export { createSelector, createStructuredSelector } from 'reselect'

export type Selector<TState, TReturns, TProps = void> = TProps extends void
	? (state: TState) => TReturns
	: (state: TState, props: TProps) => TReturns

export type ExtractSelectorsFromModel<
	TModels extends Models<TModels>,
	TModel extends Model<TModels>
> =
	// thunk case: (models) => ({...})
	TModel['selectors'] extends (...args: any[]) => infer TReturnObj
		? TReturnObj
		: // normal object case
		TModel['selectors'] extends Record<string, any>
		? TModel['selectors']
		: never

export type ExtractSelectorsSignatureFromSelectorsModel<
	TRootState,
	TSelectorsConfigObject,
	TKey extends keyof TSelectorsConfigObject
> = TSelectorsConfigObject[TKey] extends (...args: any[]) => infer TSelector
	? // hasProps case
	  TSelector extends (props: infer TProps) => Selector<any, infer TReturns>
		? (props: TProps) => Selector<TRootState, TReturns>
		: // selector without props case
		TSelector extends Selector<any, infer TReturns>
		? Selector<TRootState, TReturns>
		: // selector with props case
		TSelector extends Selector<any, infer TReturns, infer TProps>
		? Selector<TRootState, TReturns, TProps>
		: never
	: never

export interface SelectConfig<
	TModels extends Models<TModels>,
	TExtraModels extends Models<TModels>
> {
	sliceState?: (
		state: ExtractRematchStateFromModels<TModels, TExtraModels>,
		model: Model<TModels>
	) => Record<string, any> | undefined
	selectorCreator?: any
}

export type ModelSelectors<
	TModels extends Models<TModels>,
	TExtraModels extends Models<TModels>,
	TModel extends Model<TModels>
> = {
	[key in keyof ExtractSelectorsFromModel<
		TModels,
		TModel
	>]: ExtractSelectorsSignatureFromSelectorsModel<
		RematchRootState<TModels, TExtraModels>,
		ExtractSelectorsFromModel<TModels, TModel>,
		key
	>
}

export type Slicer<TSliceState, TRootState> = (<TReturns>(
	resultFn: (slice: TSliceState) => TReturns
) => Selector<TRootState, TReturns>) &
	Selector<TRootState, TSliceState>

export interface ModelSelectorFactories<
	TModels extends Models<TModels>,
	TExtraModels extends Models<TModels>,
	TSliceState = any
> {
	[key: string]:
		| SelectorFactory<TModels, TExtraModels, TSliceState>
		| SelectorParametricFactory<TModels, TExtraModels, TSliceState>
}

export type StoreSelectors<
	TModels extends Models<TModels>,
	TExtraModels extends Models<TModels>
> = {
	[TModelKey in keyof TModels]: ModelSelectors<
		TModels,
		TExtraModels,
		TModels[TModelKey]
	>
}

export type SelectorFactory<
	TModels extends Models<TModels>,
	TExtraModels extends Models<TModels>,
	TSliceState = any
> = <TReturns>(
	// FIXME: https://github.com/Microsoft/TypeScript/issues/27862
	this: ModelSelectorFactories<TModels, TExtraModels, TSliceState>,
	models: StoreSelectors<TModels, TExtraModels>
) => Selector<RematchRootState<TModels>, TReturns>

export type SelectorParametricFactory<
	TModels extends Models<TModels>,
	TExtraModels extends Models<TModels>,
	TSliceState = any,
	TProps = any,
	TReturns = any
> = (
	// FIXME: https://github.com/Microsoft/TypeScript/issues/27862
	this: ModelSelectorFactories<TModels, TExtraModels, TSliceState>,
	models: StoreSelectors<TModels, TExtraModels>,
	props: TProps
) => Selector<RematchRootState<TModels>, TReturns, TProps>

// the same as `SelectorParametricFactory` but with different return signature
export type ParameterizerSelectorFactory<
	TModels extends Models<TModels>,
	TExtraModels extends Models<TModels>,
	TSliceState = any,
	TProps = any,
	TReturns = any
> = (
	// FIXME: https://github.com/Microsoft/TypeScript/issues/27862
	this: ModelSelectorFactories<TModels, TExtraModels, TSliceState>,
	models: StoreSelectors<TModels, TExtraModels>,
	props: TProps
) => (props: TProps) => Selector<RematchRootState<TModels>, TReturns>

export type Parameterizer<
	TModels extends Models<TModels>,
	TExtraModels extends Models<TModels>,
	TSliceState = any
> = <TProps, TReturns>(
	factory: SelectorParametricFactory<
		TModels,
		TExtraModels,
		TSliceState,
		TProps,
		TReturns
	>
) => ParameterizerSelectorFactory<
	TModels,
	TExtraModels,
	TSliceState,
	TProps,
	TReturns
>

export type ModelSelectorsFactory<
	TModels extends Models<TModels>,
	TExtraModels extends Models<TModels>,
	TSliceState = any
> = (
	slice: Slicer<TSliceState, RematchRootState<TModels>>,
	createSelector: typeof Reselect.createSelector,
	hasProps: Parameterizer<TModels, TExtraModels, TSliceState>
) => ModelSelectorFactories<TModels, TExtraModels, TSliceState>

export type ModelSelectorsConfig<
	TModels extends Models<TModels>,
	TSliceState = any,
	TExtraModels extends Models<TModels> = Record<string, never>
> =
	| ModelSelectorsFactory<TModels, TExtraModels, TSliceState>
	| ModelSelectorFactories<TModels, TExtraModels, TSliceState>

export type RematchSelect<
	TModels extends Models<TModels>,
	TExtraModels extends Models<TModels>,
	TRootState = RematchRootState<TModels, TExtraModels>
> = (<TReturn extends { [key: string]: (state: TRootState) => any }>(
	mapSelectToProps: (
		select: RematchSelect<TModels, TExtraModels, TRootState>
	) => TReturn
) => Reselect.OutputParametricSelector<
	TRootState,
	any,
	{ [K in keyof TReturn]: ReturnType<TReturn[K]> },
	Reselect.Selector<TRootState, TRootState>
> &
	Reselect.OutputSelector<
		Reselect.SelectorArray,
		{ [K in keyof TReturn]: ReturnType<TReturn[K]> },
		Reselect.Selector<TRootState, TRootState>
	> &
	Reselect.Selector<TRootState, TRootState>) &
	StoreSelectors<TModels, TExtraModels>

declare module '@rematch/core' {
	// Add overloads for store to add select
	interface RematchStore<
		TModels extends Models<TModels>,
		TExtraModels extends Models<TModels>
	> extends ReduxStore<RematchRootState<TModels, TExtraModels>, Action> {
		select: RematchSelect<
			TModels,
			TExtraModels,
			RematchRootState<TModels, TExtraModels>
		>
	}

	// add overloads for Model here.
	interface Model<TModels extends Models<TModels>, TState = any> {
		selectors?: ModelSelectorsConfig<TModels, TState>
	}

	// add overloads for ModelCreator here.
	interface ModelCreator {
		<RM extends Models<RM>>(): <
			R extends ModelReducers<S> | undefined,
			BR extends ReduxReducer<BS> | undefined,
			E extends ModelEffects<RM> | ModelEffectsCreator<RM> | undefined,
			SE extends ModelSelectorsConfig<RM, S> | undefined,
			S,
			BS = S
		>(mo: {
			name?: string
			state: S
			reducers?: R
			baseReducer?: BR
			effects?: E
			selectors?: SE
		}) => {
			name?: string
			state: S
		} & (E extends undefined
			? {}
			: {
					effects: E
			  }) &
			(R extends undefined
				? {}
				: {
						reducers: R
				  }) &
			(BR extends undefined
				? {}
				: {
						baseReducer: BR
				  }) &
			(SE extends undefined
				? {}
				: {
						selectors: SE
				  })
	}
}
