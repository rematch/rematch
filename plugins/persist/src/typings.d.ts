import { Action, Models, Plugin } from '@rematch/core'
import {
	PersistorOptions,
	Persistor,
	WebStorage,
	AsyncStorage,
	LocalForageStorage,
	Storage,
	Transform,
	PersistedState,
} from 'redux-persist'

export declare const getPersistor: () => Persistor

interface PluginPersistConfig {
	key?: string
	version?: number
	storage?: WebStorage | AsyncStorage | LocalForageStorage | Storage
	/**
	 * **Depricated:** keyPrefix is going to be removed in v6.
	 */
	keyPrefix?: string
	blacklist?: Array<string>
	whitelist?: Array<string>
	transforms?: Array<Transform<any, any>>
	throttle?: number
	migrate?: (
		state: PersistedState,
		versionKey: number
	) => Promise<PersistedState>
	stateReconciler?: false | Function
	/**
	 * Used for migrations.
	 */
	getStoredState?: (config: PluginPersistConfig) => Promise<PersistedState>
	debug?: boolean
	serialize?: boolean
	timeout?: number
}

declare const persistPlugin: (
	persistConfig: PluginPersistConfig,
	persistorOptions?: PersistorOptions,
	callback?: () => void
) => Plugin<Models, Action<any, any>>

export default persistPlugin
