import { Reducer as ReduxReducer } from 'redux'
import createRematchStore from './rematchStore'
import {
	InitConfig,
	Models,
	RematchStore,
	ModelReducers,
	ModelEffects,
	ModelEffectsCreator,
	RematchDispatch,
} from './types'
import createConfig from './config'

/**
 * Patch for the incompatibility between Redux.Dispatch and RematchDispatch
 */
declare module 'react-redux' {
	interface Connect {
		<
			RM extends Models<RM> = Models,
			State = DefaultRootState,
			TStateProps = {},
			TDispatchProps = {},
			TOwnProps = {}
		>(
			mapStateToProps: MapStateToPropsParam<TStateProps, TOwnProps, State>,
			mapDispatchToProps: MapRematchDispatchToPropsNonObject<
				TDispatchProps,
				TOwnProps,
				RM
			>
		): InferableComponentEnhancerWithProps<
			TStateProps & TDispatchProps,
			TOwnProps
		>
	}

	type MapRematchDispatchToPropsNonObject<
		TDispatchProps,
		TOwnProps,
		RM extends Models<RM> = Models
	> =
		| MapRematchDispatchToPropsFactory<TDispatchProps, TOwnProps, RM>
		| MapRematchDispatchToPropsFunction<TDispatchProps, TOwnProps, RM>

	type MapRematchDispatchToPropsFactory<
		TDispatchProps,
		TOwnProps,
		RM extends Models<RM> = Models
	> = (
		dispatch: RematchDispatch<RM>,
		ownProps: TOwnProps
	) => MapRematchDispatchToPropsFunction<TDispatchProps, TOwnProps, RM>

	type MapRematchDispatchToPropsFunction<
		TDispatchProps,
		TOwnProps,
		RM extends Models<RM> = Models
	> = (dispatch: RematchDispatch<RM>, ownProps: TOwnProps) => TDispatchProps
}

/**
 * Prepares a complete configuration and creates a Rematch store.
 */
export const init = <
	TExtraModels extends Models = {},
	TModels extends Models<TModels> = Models
>(
	initConfig?: InitConfig<TModels, TExtraModels>
): RematchStore<TModels & TExtraModels> => {
	const config = createConfig(initConfig || {})
	return createRematchStore<TModels, TExtraModels>(config)
}

export const createModel: <RM extends Models<RM>>() => <
	R extends ModelReducers<S>,
	BR extends ReduxReducer<BS>,
	E extends ModelEffects | ModelEffectsCreator<RM>,
	S,
	BS = S
>(mo: {
	name?: string
	state: S
	reducers?: R
	baseReducer?: BR
	effects?: E
}) => {
	name?: string
	state: S
	reducers: R
	baseReducer: BR
	effects: E
} = () => (mo): any => mo

export default {
	init,
	createModel,
}

export * from './types'
