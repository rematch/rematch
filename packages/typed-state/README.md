# Typed-state

Rematch plugin for type-checking state at runtime. Uses [prop-types](https://github.com/facebook/prop-types) for describing expected type shape.

## Install

```
npm install @rematch/typed-state
```

If your project doesn't have `prop-types` package yet, you need to add it as well:

```
npm install prop-types
```

## Setup

Use `typings` property to describe the shape of model's state, and add `typed-state` plugin when initializing a store:

```js
import T from 'prop-types'
import { init } from '@rematch/core'
import typedStatePlugin from '@rematch/typed-state'

const user = {
	state: {
		name: 'Jon',
		age: 25,
		isDeveloper: true,
		address: {
			country: 'US',
			city: 'New York',
		},
	},
	typings: {
		name: T.string.isRequired,
		age: T.number.isRequired,
		isDeveloper: T.bool,
		address: T.shape({
			country: T.string.isRequired,
			city: T.string,
		}),
	},
	reducers: {
		updateName: (state, name) => ({
			name,
		}),
	},
}

const store = init({
	models: { user },
	plugins: [typedStatePlugin()],
})
```

With that in place, if you try to update the state with invalid value type, you'll get a warning in developer tools:

```js
store.dispatch.user.updateName(undefined)

// > console.warn
// > [rematch] Invalid property `name` of type `undefined` supplied to `user`, expected `string`.
```

Please refer to [prop-types](https://github.com/facebook/prop-types#usage) documentation for a full list of available validations.
