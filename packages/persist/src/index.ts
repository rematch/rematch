/* eslint-disable @typescript-eslint/ban-ts-ignore,consistent-return */
import { Plugin, Models, ReduxReducer } from '@rematch/core'
import {
  persistReducer,
  persistStore,
  PersistConfig,
  Persistor,
  PersistorOptions,
} from 'redux-persist'

let persistor
// persistor is used for PersistGate
// see https://github.com/rt2zz/redux-persist/blob/master/docs/PersistGate.md
export const getPersistor = (): Persistor => persistor

export type NestedPersist<M extends Models> = {
  [modelKey in keyof M]?: PersistConfig<M[modelKey]['state']>
}

// rematch plugin
const persistPlugin = <S, M extends Models = Models>(
  persistConfig: PersistConfig<S>,
  nestedPersistConfig: NestedPersist<M> = {},
  persistStoreConfig?: PersistorOptions,
  callback?: () => void
): Plugin => {
  if (!persistConfig) {
    throw new Error('persist plugin is missing config object')
  }

  return {
    onReducer(reducer: ReduxReducer, modelName: string): void | ReduxReducer {
      const reducerConfig = nestedPersistConfig[modelName]
      if (reducerConfig) {
        return persistReducer(reducerConfig, reducer)
      }
    },
    onRootReducer(rootReducer: ReduxReducer): ReduxReducer {
      return persistReducer(persistConfig, rootReducer)
    },
    onStoreCreated(store): void {
      // run persist store once store is available
      persistor = persistStore(store, persistStoreConfig, callback)
    },
  }
}

export default persistPlugin
