import createRematchStore from './rematchStore'
import { InitConfig, Models, Model, RematchStore } from './types'
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

export const createModel = <TState, TBaseState = TState>() => <
	TModel extends Model<TState, TBaseState>
>(
	model: TModel
): TModel => model

export default {
	init,
	createModel,
}

export * from './types'
