import { PluginCreator } from '@rematch/core'
import { persistCombineReducers, persistStore } from 'redux-persist'

let persistor
// persistor is used for PersistGate
// see https://github.com/rt2zz/redux-persist/blob/master/docs/PersistGate.md
export const getPersistor = () => persistor

// rematch plugin
export default (config): PluginCreator => {
  if (!config) {
    throw new Error('@rematch/persist requires a config object containing "storage"')
  }
  // merge config with common config options
  const mergedConfig = {
    key: 'root',
    ...config,
  }
  return {
    config: {
      redux: {
        // pass in merged config as first param of persistCombineReducers
        combineReducers: (reducers) => persistCombineReducers(mergedConfig, reducers),
        // reset state on dispatch({ type: 'RESET' })
        rootReducers: {
          RESET: () => undefined,
        },
      },
    },
    init: () => ({
      onStoreCreated(store) {
        // run persist store once store is available
        persistor = persistStore(store)
      },
    }),
  }
}
