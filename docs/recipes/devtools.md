# Devtools

## Redux-Devtools

Rematch works with [Redux Devtools](https://github.com/zalmoxisus/redux-devtools-extension) out of the box. No configuration required.

```javascript
init() // devtools up and running
```

Its also possible to add redux devtools [configuration options](https://github.com/zalmoxisus/redux-devtools-extension/blob/master/docs/API/Arguments.md).

```javascript
init({
	redux: {
		devtoolOptions: options,
	},
})
```

To disable redux devtools, set `disabled` property to `true`:

```javascript
init({
	redux: {
		devtoolOptions: {
			disabled: true,
		},
	},
})
```

## Remote-Redux-Devtools

To use Redux Devtools in React Native, simply use [Remote Redux Devtools](https://github.com/zalmoxisus/remote-redux-devtools).

1.

```javascript
npm install --save-dev remote-redux-devtools
```

or

```javascript
yarn add -D remote-redux-devtools
```

2.

```javascript
import { composeWithDevTools } from 'remote-redux-devtools'

init({
	redux: {
		enhancers: [composeWithDevTools()],
	},
})
```

1. Run the app, open debug menu, and select `Debug JS Remotely`.
2. Run Redux Devtools in Chrome, and select `remote` at the bottom of the devtools window

## Reactotron

Setup Rematch to also work with [Reactotron devtools](https://github.com/infinitered/reactotron).

```javascript
// Reactotron.config.js
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

```javascript
// index.js
import Reactotron from './Reactotron.config.js'

init({
	redux: {
		createStore: Reactotron.createStore,
	},
})
```
