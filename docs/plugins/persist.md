# Persist Plugin

Redux-Persist v6 plugin for Rematch. Provides automatic Redux state persistence.

## Compatibility {docsify-ignore}

Install the correct version of persist plugin based on the version of the core Rematch library in your project.

|         @rematch/core  | @rematch/persist  |
| :--------------------: | :----: |
| 0.x ‎                   |   0.2.1  |
| 1.x                    |    1.x   |
| 2.x                    |    2.x   |

## Install {docsify-ignore}

```bash
npm install @rematch/persist
```

## persistPlugin(persistConfig, [nestedPersistConfig, persistStoreConfig, callback]) {docsify-ignore}

The persist plugin accepts four arguments - **persistConfig**, **nestedPersistConfig**, **persistStoreConfig**, **callback**.

- `persistConfig` (_PersistConfig_): object compatible with _config_ argument accepted by redux-persist's _persistReducer_ method - for details refer to their [documentation](https://github.com/rt2zz/redux-persist#persistreducerconfig-reducer). It is used when creating a persisted root reducer in your store.

- [`nestedPersistConfig`] (_{ [modelName]: PersistConfig }_): whenever you need to use a [Nested Persist](https://github.com/rt2zz/redux-persist#nested-persists) configuration for some models, provide an object with a mapping from the model name to the redux-persist config for this model.

- [`persistStoreConfig`] (_PersistorOptions_): object compatible with _config_ argument accepted by redux-persist's _persistStore_ method - for details refer to their [documentation](https://github.com/rt2zz/redux-persist#persiststorestore-config-callback).

- [`callback`] (_() => void_): a function called after rehydration is finished.

## Usage {docsify-ignore}

**store.js**

```javascript
import persistPlugin from '@rematch/persist'
import { init } from '@rematch/core'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
  key: 'root',
  storage,
}

init({
    // add persistPlugin to your store
	plugins: [persistPlugin(persistConfig)],
})
```

### Persist Gate

In React you can use a special component provided by redux-persist to display a loading indicator while waiting for data to async load from the storage.

```javascript
import { getPersistor } from '@rematch/persist'
import { PersistGate } from 'redux-persist/lib/integration/react'

const persistor = getPersistor()

const Root = () => (
	<PersistGate persistor={persistor}>
		<App />
	</PersistGate>
)
```
