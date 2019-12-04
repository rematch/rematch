import Rematch from './rematch'
import * as R from './typings'
import mergeConfig from './utils/mergeConfig'

/**
 * global createModel
 *
 * creates a model for the given object
 * this is for autocomplete purposes only
 * returns the same object that was received as argument
 */
export function createModel<S = any, M extends R.Model<S> = any>(model: M): M {
	return model
}

// incrementer used to provide a store name if none exists
let count = 0

/**
 * init
 *
 * generates a Rematch store
 * with a set configuration
 * @param initConfig
 */
export const init = (initConfig: R.InitConfig = {}): R.RematchStore => {
	const name = initConfig.name || count.toString()
	count += 1
	const config: R.Config = mergeConfig({ ...initConfig, name })
	return new Rematch(config).createStore()
}

export default {
	init,
}
