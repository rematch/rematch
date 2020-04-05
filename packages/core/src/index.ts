import createRematchStore from './rematchStore'
import { InitConfig, Models, RematchStore } from './types'
import createConfig from './config'

/**
 * Prepares a complete configuration and creates a Rematch store.
 */
export const init = <M extends Models>(
	initConfig?: InitConfig<M>
): RematchStore<M> => {
	const config = createConfig(initConfig || {})
	return createRematchStore(config)
}

export default {
	init,
}

export * from './types'
