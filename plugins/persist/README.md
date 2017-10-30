# Rematch Persist

Redux-Persist v5 plugin for Rematch.

Provides simple redux state persistence using local storage options.

## Setup

```js
const persistPlugin = rematchPersist({
  whiteList: ['modelName1'],
  throttle: 5000,
  version: 1
})

init({
  plugins: [persistPlugin]
})
```

### Persistor

```js
const persistor = getPersistor()
```

### Config Options

See [redux-persist config docs](https://github.com/rt2zz/redux-persist/blob/master/docs/api.md#type-persistconfig)