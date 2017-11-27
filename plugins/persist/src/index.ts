import { persistStore, persistCombineReducers } from 'redux-persist'
// defaults to localStorage in browser, AsyncStorage in React-Native
import storage from 'redux-persist/lib/storage'

const commonConfig = {
  key: 'root',
  storage,
}

let persistor
// persistor is used for PersistGate
// see https://github.com/rt2zz/redux-persist/blob/master/docs/PersistGate.md
export const getPersistor = () => persistor

// rematch plugin
export default (config = {}) => {
  // merge config with common config options
  const mergedConfig = {
    ...commonConfig,
    ...config,
  }
  return {
    config: {
      // pass in merged config as first param of persistCombineReducers
      redux: {
        combineReducers: persistCombineReducers.bind(null, mergedConfig),
      },
    },
    init: () => ({
      onStoreCreated(getStore) {
        // run persist store once store is available
        persistor = persistStore(getStore())
      },
    }),
  }
}
