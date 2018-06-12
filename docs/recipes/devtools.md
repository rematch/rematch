# Devtools

### Redux-Devtools

Rematch works with [Redux Devtools](https://github.com/zalmoxisus/redux-devtools-extension) out of the box. No configuration required.

```js
init() // devtools up and running
```

Its also possible to add redux devtools [configuration options](https://github.com/zalmoxisus/redux-devtools-extension/blob/master/docs/API/Arguments.md).

```js
init({
  redux: {
    devtoolOptions: options,
  },
})
```

### Redux-Devtools-Remote

To use Redux Devtools in React Native, simply use [Remote Redux Devtools](https://github.com/zalmoxisus/remote-redux-devtools).

1.

```js
npm install --save-dev remote-redux-devtools
```

or

```js
yarn add -D remote-redux-devtools
```

2.

```js
import { composeWithDevTools } from 'remote-redux-devtools'

init({
  redux: {
    enhancers: [composeWithDevTools()],
  },
})
```

3. Run the app, open debug menu, and select `Debug JS Remotely`.

4. Run Redux Devtools in Chrome, and select `remote` at the bottom of the devtools window


### Reactotron

Setup Rematch to also work with [Reactotron devtools](https://github.com/infinitered/reactotron).

```js
// Reactotron.config.js
import Reactotron from 'reactotron-react-native'
import { reactotronRedux } from 'reactotron-redux'

export default Reactotron
  .configure({
    name: 'MyAwesomeApp'
  })
  .use(reactotronRedux())
  // add other devtools here
  .connect()
```

Overwrite `createStore` to complete the config.

```js
// index.js
import Reactotron from './Reactotron.config.js'

init({
  redux: {
    createStore: Reactotron.createStore,
  }
})
```
