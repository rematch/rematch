import { Plugin } from '@rematch/core'
import { persistCombineReducers, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

let persistor
// persistor is used for PersistGate
// see https://github.com/rt2zz/redux-persist/blob/master/docs/PersistGate.md
export const getPersistor = () => persistor

// rematch plugin
const persistPlugin = (config = {}, callback): Plugin => {
	// merge config with common config options
	const mergedConfig = {
		key: 'root',
		storage,
		...config,
	}
	return {
		config: {
			// pass in merged config as first param of persistCombineReducers
			redux: {
				combineReducers: persistCombineReducers.bind(null, mergedConfig),
			},
		},
		onStoreCreated(store) {
			// run persist store once store is available
			persistor = persistStore(store, null, callback)
		},
	}
}

export default persistPlugin
