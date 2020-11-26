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
	TModels extends Models<TModels> = Record<string, any>,
	TModel extends Model<TModels> = Model<TModels>
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
	TModels extends Models<TModels> = Record<string, any>
> {
	sliceState?: (
		state: ExtractRematchStateFromModels<TModels>,
		model: Model<TModels>
	) => Record<string, any> | undefined
	selectorCreator?: any
}

export type ModelSelectors<
	TModels extends Models<TModels> = Record<string, any>,
	TModel extends Model<TModels> = Model<TModels>,
	TRootState = Record<string, any>
> = {
	[key in keyof ExtractSelectorsFromModel<
		TModels,
		TModel
	>]: ExtractSelectorsSignatureFromSelectorsModel<
		TRootState,
		ExtractSelectorsFromModel<TModels, TModel>,
		key
	>
}

export type Slicer<TSliceState, TRootState> = (<TReturns>(
	resultFn: (slice: TSliceState) => TReturns
) => Selector<TRootState, TReturns>) &
	Selector<TRootState, TSliceState>

export interface ModelSelectorFactories<
	TSliceState = any,
	TRootState = Record<string, any>
> {
	[key: string]:
		| SelectorFactory<TSliceState, TRootState>
		| SelectorParametricFactory<TSliceState, TRootState>
}

export type ModelsSelectors<TRootState = Record<string, any>> = {
	[key: string]: ModelSelectorFactories<any, TRootState>
}

export type SelectorFactory<
	TSliceState = any,
	TRootState = Record<string, any>
> = <TReturns>(
	// FIXME: https://github.com/Microsoft/TypeScript/issues/27862
	this: ModelSelectorFactories<TSliceState, TRootState>,
	models: ModelsSelectors<TRootState>
) => Selector<TRootState, TReturns>

export type SelectorParametricFactory<
	TSliceState = any,
	TRootState = Record<string, any>,
	TProps = any,
	TReturns = any
> = (
	// FIXME: https://github.com/Microsoft/TypeScript/issues/27862
	this: ModelSelectorFactories<TSliceState, TRootState>,
	models: ModelsSelectors<TRootState>,
	props: TProps
) => Selector<TRootState, TReturns, TProps>

// the same as `SelectorParametricFactory` but with different return signature
export type ParameterizerSelectorFactory<
	TSliceState = any,
	TRootState = Record<string, any>,
	TProps = any,
	TReturns = any
> = (
	// FIXME: https://github.com/Microsoft/TypeScript/issues/27862
	this: ModelSelectorFactories<TSliceState, TRootState>,
	models: ModelsSelectors<TRootState>,
	props: TProps
) => (props: TProps) => Selector<TRootState, TReturns>

export type Parameterizer<
	TSliceState = any,
	TRootState = Record<string, any>
> = <TProps, TReturns>(
	factory: SelectorParametricFactory<TSliceState, TRootState, TProps, TReturns>
) => ParameterizerSelectorFactory<TSliceState, TRootState, TProps, TReturns>

export type ModelSelectorsFactory<
	TSliceState = any,
	TRootState = Record<string, any>
> = (
	slice: Slicer<TSliceState, TRootState>,
	createSelector: typeof Reselect.createSelector,
	hasProps: Parameterizer<TSliceState, TRootState>
) => ModelSelectorFactories<TSliceState, TRootState>

export type ModelSelectorsConfig<
	TSliceState = any,
	TRootState = Record<string, any>
> =
	| ModelSelectorsFactory<TSliceState, TRootState>
	| ModelSelectorFactories<TSliceState, TRootState>

export type StoreSelectors<
	TModels extends Models<TModels> = Record<string, any>,
	TRootState = Record<string, any>
> = {
	[TModelKey in keyof TModels]: ModelSelectors<
		TModels,
		TModels[TModelKey],
		TRootState
	>
}

export type RematchSelect<
	TModels extends Models<TModels>,
	TRootState = Record<string, any>
> = ((
	mapSelectToProps: (
		select: RematchSelect<TModels, TRootState>
	) => Record<string, any>
) => Reselect.OutputParametricSelector<
	TRootState,
	any,
	Record<string, any>,
	Reselect.Selector<TRootState, Record<string, any>>
>) &
	StoreSelectors<TModels, TRootState>

declare module '@rematch/core' {
	// Add overloads for store to add select
	interface RematchStore<TModels extends Models<TModels> = Record<string, any>>
		extends ReduxStore<RematchRootState<TModels>, Action> {
		select: RematchSelect<TModels, RematchRootState<TModels>>
	}

	// add overloads for Model here.
	interface Model<
		TModels extends Models<TModels> = Record<string, any>,
		TState = any
	> {
		selectors?: ModelSelectorsConfig<TState, RematchRootState<TModels>>
	}

	// add overloads for ModelCreator here.
	interface ModelCreator {
		<RM extends Models<RM>>(): <
			R extends ModelReducers<S>,
			BR extends ReduxReducer<BS>,
			E extends ModelEffects<RM> | ModelEffectsCreator<RM>,
			SE extends ModelSelectorsConfig<S, RematchRootState<RM>>,
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
			selectors: SE
			reducers: R
			baseReducer: BR
			effects: E
		}
	}
}
