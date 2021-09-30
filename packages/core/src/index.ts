import createRematchStore from './rematchStore'
import { InitConfig, Models, RematchStore, ModelCreator } from './types'
import createConfig from './config'

/**
 * Prepares a complete configuration and creates a Rematch store.
 */
export const init = <
	TModels extends Models<TModels>,
	TExtraModels extends Models<TModels> = Record<string, never>
>(
	initConfig?: InitConfig<TModels, TExtraModels>
): RematchStore<TModels, TExtraModels> => {
	const config = createConfig(initConfig || {})
	return createRematchStore(config)
}

export const createModel: ModelCreator = () => (mo) => mo as any

export default {
	init,
	createModel,
}

export * from './types'
