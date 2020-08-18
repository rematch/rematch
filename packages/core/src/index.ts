import createRematchStore from './rematchStore'
import { InitConfig, Models, Model, RematchStore } from './types'
import createConfig from './config'

/**
 * Prepares a complete configuration and creates a Rematch store.
 */
export const init = <
	TModels extends Models<TModels>,
	TExtraModels extends Models
>(
	initConfig?: InitConfig<TModels>
): RematchStore<TModels & TExtraModels> => {
	const config = createConfig(initConfig || {})
	return createRematchStore<TModels, TExtraModels>(config)
}

export const createModel: <TModels, State, BaseState = State>() => <
	M extends Model<State, BaseState, TModels>
>(
	mo: M
) => Omit<M, 'state'> & { state: State } = () => (mo): any => mo

export default {
	init,
	createModel,
}

export * from './types'
