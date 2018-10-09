import { Action, Models, Plugin } from '@rematch/core'
import { PersistConfig, PersistorOptions, Persistor } from 'redux-persist'

export declare const getPersistor: () => Persistor

declare const persistPlugin: (
    persistConfig: PersistConfig,
    persistorOptions?: PersistorOptions,
    callback?: () => void
) => Plugin<Models, Action<any, any>>

export default persistPlugin
