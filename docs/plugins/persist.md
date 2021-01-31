---
id: persist
title: Persist
sidebar_label: "@rematch/persist"
slug: /plugins/persist/
---
Redux-Persist v6 plugin for Rematch. Provides automatic Redux state persistence.

## Compatibility

Install the correct version of persist plugin based on the version of the core Rematch library in your project.

|         @rematch/core  | @rematch/persist  |
| :--------------------: | :----: |
| 1.x.x                   |    1.x.x  |
| 2.x.x                   |    2.x.x  |

## Install

```bash npm2yarn
npm install @rematch/persist
```

## persistPlugin(persistConfig, [nestedPersistConfig, persistStoreConfig, callback])

The persist plugin accepts four arguments - **persistConfig**, **nestedPersistConfig**, **persistStoreConfig**, **callback**.

- `persistConfig` (_PersistConfig_): object compatible with _config_ argument accepted by redux-persist's _persistReducer_ method - for details refer to their [documentation](https://github.com/rt2zz/redux-persist#persistreducerconfig-reducer). It is used when creating a persisted root reducer in your store.

- [`nestedPersistConfig`] (_{ [modelName]: PersistConfig }_): whenever you need to use a [Nested Persist](https://github.com/rt2zz/redux-persist#nested-persists) configuration for some models, provide an object with a mapping from the model name to the redux-persist config for this model.

- [`persistStoreConfig`] (_PersistorOptions_): object compatible with _config_ argument accepted by redux-persist's _persistStore_ method - for details refer to their [documentation](https://github.com/rt2zz/redux-persist#persiststorestore-config-callback).

- [`callback`] (_() => void_): a function called after rehydration is finished.

## Usage

### Setup the store

```js title="store.js"
import persistPlugin from '@rematch/persist'
import { init } from '@rematch/core'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
  key: 'root',
  storage,
}

init({
	plugins: [persistPlugin(persistConfig)],
})
```

### Persist Gate

In React you can use a special component provided by redux-persist to display a loading indicator while waiting for data to async load from the storage.

```js
import { getPersistor } from '@rematch/persist'
import { PersistGate } from 'redux-persist/lib/integration/react'

const persistor = getPersistor()

const Root = () => (
	<PersistGate persistor={persistor}>
		<App />
	</PersistGate>
)
```