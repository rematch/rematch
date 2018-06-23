import Rematch from './rematch'
import * as R from './typings'
import deprecate from './utils/deprecate'
import mergeConfig from './utils/mergeConfig'

export const getState = () => {
	deprecate(`global getState has been removed in @rematch/core 1.0.0-beta.3.
	See https://github.com/rematch/rematch/blob/master/CHANGELOG.md#100-beta3---2018-06-23 for details.
	For a quick fix, import and use store.getState.`)
}

export const dispatch = () => {
	deprecate(`global dispatch has been removed in @rematch/core 1.0.0-beta.3.
	See https://github.com/rematch/rematch/blob/master/CHANGELOG.md#100-beta3---2018-06-23 for details.
	For a quick fix, import and use store.dispatch.`)
}


/**
 * global createModel
 *
 * creates a model for the given object
 * this is for autocomplete purposes only
 * returns the same object that was received as argument
 */
export function createModel<S = any, M extends R.ModelConfig<S> = any>(model: M) {
	return model
}

// incrementer used to provide a store name if none exists
let count = 0

/**
 * init
 *
 * generates a Rematch store
 * with a set configuration
 * @param config
 */
export const init = (initConfig: R.InitConfig = {}): R.RematchStore => {
	const name = initConfig.name || count.toString()
	count += 1
	const config: R.Config = mergeConfig({ ...initConfig, name })
	return new Rematch(config).init()
}

export default {
	init,
}
