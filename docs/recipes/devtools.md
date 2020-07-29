# Devtools {docsify-ignore}

## Redux-Devtools {docsify-ignore}

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

## Remote-Redux-Devtools {docsify-ignore}

Remote-redux-devtools is not supported in rematch see this [issue](https://github.com/rematch/rematch/issues/419).
You can use [react-native-debugger](https://github.com/jhen0409/react-native-debugger) which works out of the box with rematch.

## Reactotron {docsify-ignore}

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
		enhancers: [Reactotron.createEnhancer()],
		// If using typescript/flow, enhancers: [Reactotron.createEnhancer!()]
	},
})
```
