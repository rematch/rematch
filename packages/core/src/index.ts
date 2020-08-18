import { Reducer as ReduxReducer } from 'redux'
import createRematchStore from './rematchStore'
import {
	InitConfig,
	Models,
	RematchStore,
	ModelReducers,
	ModelEffects,
	ModelEffectsCreator,
} from './types'
import createConfig from './config'

/**
 * Prepares a complete configuration and creates a Rematch store.
 */
export const init = <TModels extends Models, TExtraModels extends Models>(
	initConfig?: InitConfig<TModels>
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
