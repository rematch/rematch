import { PluginCreator } from '@rematch/core'
import { persistCombineReducers, persistStore } from 'redux-persist'

const commonConfig = {
  key: 'root',
}

let persistor
// persistor is used for PersistGate
// see https://github.com/rt2zz/redux-persist/blob/master/docs/PersistGate.md
export const getPersistor = () => persistor

// rematch plugin
export default (config = {}): PluginCreator => {
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
