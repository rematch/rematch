---
id: redux-devtools
title: Redux Devtools
sidebar_label: "Redux Devtools"
slug: /recipes/redux-devtools/
---

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

To disable redux devtools, set `disabled` property to `true`:

```js
init({
	redux: {
		devtoolOptions: {
			disabled: true,
		},
	},
})
```

## Remote Redux-Devtools

Remote-redux-devtools is not supported in rematch see this [issue](https://github.com/rematch/rematch/issues/419).
You can use [react-native-debugger](https://github.com/jhen0409/react-native-debugger) which works out of the box with rematch.

## Reactotron

Setup Rematch to also work with [Reactotron devtools](https://github.com/infinitered/reactotron).

```js
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

```js
// index.js
import Reactotron from './Reactotron.config.js'

init({
	redux: {
		enhancers: [Reactotron.createEnhancer()],
		// If using typescript/flow, enhancers: [Reactotron.createEnhancer!()]
	},
})
```