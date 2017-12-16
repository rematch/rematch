# Rematch Persist

Redux-Persist v5 plugin for Rematch.

Provides simple redux state persistence using local storage options.

![persist](https://user-images.githubusercontent.com/4660659/33304219-67bd1dc6-d3bc-11e7-8159-a05d65c170bf.gif)

## Install

```
npm install @rematch/persist redux-persist
```

## Setup

```js
import createRematchPersist from '@rematch/persist'
import storage from 'redux-persist/lib/storage'

const persistPlugin = rematchPersist({
  storage, // required
  whiteList: ['modelName1'],
  throttle: 5000,
  version: 1,
})

init({
  plugins: [persistPlugin()]
})
```

### Persistor

```js
import { getPersistor } from '@rematch/persist'
import { PersistGate } from 'redux-persist/es/integration/react'

const persistor = getPersistor()

const Root = () => {
  <PersistGate persistor={persistor}>
    <App />
  </PersistGate>
}
```

### Clear

```js
import { PURGE } from 'redux-persist'

dispatch({ type: PURGE }) // clears local storage
dispatch({ type: 'RESET' }) // resets state to initial state
```

### Config Options

See [redux-persist config docs](https://github.com/rt2zz/redux-persist/blob/master/docs/api.md#type-persistconfig)

