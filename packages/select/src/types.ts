// Type definitions for @rematch/select 3.0.0
// Definitions by: Sam Richard <https://github.com/d3dc>
import {
	Action,
	ModelEffects,
	ModelEffectsCreator,
	ModelReducers,
	Models,
	RematchRootState,
	Model,
} from '@rematch/core'
import * as Reselect from 'reselect'
import { Store as ReduxStore, Reducer as ReduxReducer } from 'redux'

export { createSelector, createStructuredSelector } from 'reselect'

export interface SelectConfig {
	sliceState?: any
	selectorCreator?: any
}

export type Selector<TState, TReturns, TProps = void> = TProps extends void
	? (state: TState) => TReturns
	: (state: TState, props: TProps) => TReturns

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

export type ReturnTypeOfSelectProps<TSelectProps> = {
	[key in keyof TSelectProps]: TSelectProps[key] extends (
		...args: any[]
	) => infer TReturn
		? TReturn
		: never
}

export type ExtractSelectorsFromModel<
	TModels extends Models<TModels> = Record<string, any>,
	TModel extends Model<TModels> = Model<TModels>
> =
	// thunk case: (models) => ({...})
	TModel['selectors'] extends (...args: any[]) => infer TReturnObj
		? TReturnObj
		: // normal object case
		TModel['selectors'] extends object
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

export type SelectorFactory<
	TModels extends Models<TModels> = Record<string, any>,
	TSliceState = Record<string, any>,
	TRootState = Record<string, any>
> = <TReturns>(
	// FIXME: https://github.com/Microsoft/TypeScript/issues/27862
	this: ModelSelectorFactories<TModels, TSliceState, TRootState>,
	models: ModelsSelectors<TModels, TRootState>
) => Selector<TRootState, TReturns>

export type ModelsSelectors<
	TModels extends Models<TModels> = Record<string, any>,
	TRootState = Record<string, any>
> = {
	[key: string]: ModelSelectorFactories<TModels, TRootState>
}

export type SelectorParametricFactory<
	TModels extends Models<TModels> = Record<string, any>,
	TSliceState = Record<string, any>,
	TRootState = Record<string, any>,
	TProps = any,
	TReturns = any
> = (
	// FIXME: https://github.com/Microsoft/TypeScript/issues/27862
	this: ModelSelectorFactories<TModels, TSliceState, TRootState>,
	models: ModelsSelectors<TModels, TRootState>,
	props: TProps
) => Selector<TRootState, TReturns, TProps>

// the same as `SelectorParametricFactory` but with different return signature
export type ParameterizerSelectorFactory<
	TModels extends Models<TModels> = Record<string, any>,
	TSliceState = Record<string, any>,
	TRootState = Record<string, any>,
	TProps = any,
	TReturns = any
> = (
	// FIXME: https://github.com/Microsoft/TypeScript/issues/27862
	this: ModelSelectorFactories<TModels, TSliceState, TRootState>,
	models: ModelsSelectors<TModels, TRootState>,
	props: TProps
) => (props: TProps) => Selector<TRootState, TReturns>

export type Slicer<TSliceState, TRootState> = (<TReturns>(
	resultFn: (slice: TSliceState) => TReturns
) => Selector<TRootState, TReturns>) &
	Selector<TRootState, TSliceState>
export type SelectorCreator = typeof Reselect.createSelector

export type Parameterizer<
	TModels extends Models<TModels> = Record<string, any>,
	TSliceState = Record<string, any>,
	TRootState = Record<string, any>
> = <TProps, TReturns>(
	factory: SelectorParametricFactory<
		TModels,
		TSliceState,
		TRootState,
		TProps,
		TReturns
	>
) => ParameterizerSelectorFactory<
	TModels,
	TSliceState,
	TRootState,
	TProps,
	TReturns
>

export interface ModelSelectorFactories<
	TModels extends Models<TModels> = Record<string, any>,
	TSliceState = Record<string, any>,
	TRootState = Record<string, any>
> {
	[key: string]:
		| SelectorFactory<TModels, TSliceState, TRootState>
		| SelectorParametricFactory<TModels, TSliceState, TRootState>
}

export type ModelSelectorsFactory<
	TModels extends Models<TModels> = Record<string, any>,
	S = any,
	TRootState = Record<string, any>
> = (
	slice: Slicer<S, TRootState>,
	createSelector: SelectorCreator,
	hasProps: Parameterizer<TModels, S, TRootState>
) => ModelSelectorFactories<TModels, S, TRootState>

export type ModelSelectorsConfig<
	TModels extends Models<TModels> = Record<string, any>,
	S = any,
	TRootState = Record<string, any>
> =
	| ModelSelectorsFactory<TModels, S, TRootState>
	| ModelSelectorFactories<TModels, S, TRootState>

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
		selectors?: ModelSelectorsConfig<TModels, TState, RematchRootState<TModels>>
	}

	// add overloads for ModelCreator here.
	interface ModelCreator {
		<RM extends Models<RM>>(): <
			R extends ModelReducers<S>,
			BR extends ReduxReducer<BS>,
			E extends ModelEffects | ModelEffectsCreator<RM>,
			SE extends ModelSelectorsConfig<RM, S, RematchRootState<RM>>,
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
