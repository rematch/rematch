import { Plugin, Models } from '@rematch/core'
import {
	persistReducer,
	persistStore,
	PersistConfig,
	Persistor,
	PersistorOptions,
} from 'redux-persist'
import Redux from 'redux'

let persistor: Persistor
// persistor is used for PersistGate
// see https://github.com/rt2zz/redux-persist/blob/master/docs/PersistGate.md
export const getPersistor = (): Persistor => persistor

export type NestedPersist<M extends Models<M>> = {
	[modelKey in keyof M]?: PersistConfig<M[modelKey]['state']>
}

// rematch plugin
const persistPlugin = <
	S,
	TModels extends Models<TModels>,
	TExtraModels extends Models<TModels> = Record<string, any>
>(
	persistConfig: PersistConfig<S>,
	nestedPersistConfig: NestedPersist<TModels> = {},
	persistStoreConfig?: PersistorOptions,
	callback?: () => void
): Plugin<TModels, TExtraModels> => {
	if (!persistConfig) {
		throw new Error('persist plugin is missing config object')
	}

	return {
		onReducer(reducer: Redux.Reducer, modelName: string): void | Redux.Reducer {
			const reducerConfig = nestedPersistConfig[modelName]
			if (reducerConfig) {
				return persistReducer(reducerConfig, reducer)
			}
			return undefined
		},
		onRootReducer(rootReducer: Redux.Reducer): Redux.Reducer {
			return persistReducer(persistConfig, rootReducer)
		},
		onStoreCreated(store): void {
			// run persist store once store is available
			persistor = persistStore(store, persistStoreConfig, callback)
		},
	}
}

export default persistPlugin
