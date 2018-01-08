# Devtools

### Redux-Devtools

Rematch works with [Redux Devtools](https://github.com/zalmoxisus/redux-devtools-extension) out of the box. No configuration required.

```js
init() // devtools up and running
```

Its also possible to add redux devtools [configuration options](https://github.com/zalmoxisus/redux-devtools-extension/blob/master/docs/API/Arguments.md).

```js
init({
  devtoolOptions: options,
})
```

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