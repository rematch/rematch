---
id: redux-devtools
title: Redux Devtools
sidebar_label: 'Redux Devtools'
slug: /recipes/redux-devtools/
---

Rematch works with [Redux Devtools](https://github.com/zalmoxisus/redux-devtools-extension) out of the box. No configuration required.

```ts twoslash
import { init } from '@rematch/core'
init() // devtools up and running
```

Its also possible to add redux devtools [configuration options](https://github.com/zalmoxisus/redux-devtools-extension/blob/master/docs/API/Arguments.md).

```ts twoslash
import { init } from '@rematch/core'

init({
  redux: {
    devtoolOptions: {
      actionSanitizer: (action) => action,
    },
  },
})
```

To disable redux devtools, set `disabled` property to `true`:

```ts twoslash
import { init } from '@rematch/core'

init({
  redux: {
    devtoolOptions: {
      disabled: true,
    },
  },
})
```

## Remote Redux-Devtools

Remote-redux-devtools is supported in Rematch since 2.2.0.

```ts twoslash
import { init } from '@rematch/core'
import { composeWithDevTools } from 'remote-redux-devtools'

init({
  redux: {
    devtoolComposer: composeWithDevTools({
      realtime: true,
      port: 8000,
    }),
  },
})
```

### Example

To start a SocketCluster you can install:

```bash npm2yarn
npm install --save-dev @redux-devtools/cli
```

And add a script in your `package.json` to start the SocketCluster:

```json
{
  "scripts": {
    "start-socket": "redux-devtools --open=electron --hostname=localhost --port=8000"
  }
}
```

With this ready, you just need to run your application as usual and this script `npm run start-socket` or `yarn run start-socket`.

You'll need to configure the `remote-redux-devtools` composer to match the SocketCluster configuration:

```ts twoslash{8,9}
import { init } from '@rematch/core'
import { composeWithDevTools } from 'remote-redux-devtools'

init({
  redux: {
    devtoolComposer: composeWithDevTools({
      realtime: true,
      hostname: 'localhost',
      port: 8000,
    }),
  },
})
```

After that you should see something like this in your Remote devtool:

![Remote Devtools working with Rematch Example](/img/remote-devtools.png)

## React Native Debugger

You can use [react-native-debugger](https://github.com/jhen0409/react-native-debugger) which works out of the box with Rematch.

## Reactotron

Setup Rematch to also work with [Reactotron devtools](https://github.com/infinitered/reactotron).

```ts twoslash title="Reactotron.config.js"
// @noErrors
import Reactotron from 'reactotron-react-native'
import { reactotronRedux } from 'reactotron-redux'

export default Reactotron.configure({
  name: 'MyAwesomeApp',
})
  .use(reactotronRedux())
  // add other devtools here
  .connect()
```

Overwrite `createStore` to complete the config.

```ts twoslash title="store.ts"
// @noErrors
import { init } from '@rematch/core'
import Reactotron from './Reactotron.config.js'

init({
  redux: {
    enhancers: [Reactotron.createEnhancer()],
    // If using typescript/flow, enhancers: [Reactotron.createEnhancer!()]
  },
})
```
