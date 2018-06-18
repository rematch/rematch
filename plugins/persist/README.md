# Rematch Persist

Redux-Persist v5 plugin for Rematch.

Provides simple redux state persistence using local storage options.

![persist](https://user-images.githubusercontent.com/4660659/33304219-67bd1dc6-d3bc-11e7-8159-a05d65c170bf.gif)

## Install

```
npm install @rematch/persist
```

> For @rematch/core@0.x use @rematch/persist@0.2.1

## Setup

```js
import createRematchPersist from '@rematch/persist'

const persistPlugin = createRematchPersist({
  whitelist: ['modelName1'],
  throttle: 5000,
  version: 1,
})

init({
  plugins: [persistPlugin]
})
```

### Persist Gate

With React, display a loading indicator while waiting for data to async load from storage.

```js
import { getPersistor } from '@rematch/persist'
import { PersistGate } from 'redux-persist/lib/integration/react'

const persistor = getPersistor()

const Root = () => {
  <PersistGate persistor={persistor}>
    <App />
  </PersistGate>
}
```

### Config Options

See [redux-persist config docs](https://github.com/rt2zz/redux-persist/blob/master/docs/api.md#type-persistconfig)
