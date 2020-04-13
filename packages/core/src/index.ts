import createRematchStore from './rematchStore'
import { InitConfig, Models, RematchStore } from './types'
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

export default {
	init,
}

export * from './types'
