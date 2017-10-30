import { persistStore, persistCombineReducers } from 'redux-persist'
// defaults to localStorage in browser, AsyncStorage in React-Native
import storage from 'redux-persist/lib/storage'

const commonConfig = {
  key: 'root',
  storage,
}

let persistor
export const getPersistor = () => persistor

export default (config = {}) => {
  const mergedConfig = {
    ...commonConfig,
    ...config,
  }
  return {
    config: {
      // pass in merged config as first param of persistCombineReducers
      rootReducerEnhancer: persistCombineReducers.bind(mergedConfig),
      storeEnhancer: persistStore,
    },
    init: () => ({
      onInit(getStore) {
        persistor = persistStore(getStore())
      },
    })
  }
}
