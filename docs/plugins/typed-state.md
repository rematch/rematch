---
id: typed-state
title: Typed State
sidebar_label: "@rematch/typed-state"
slug: /plugins/typed-state/
---

Rematch plugin for type-checking state at runtime. Uses [prop-types](https://github.com/facebook/prop-types) for describing expected type shape.


## Install

```bash npm2yarn
npm install @rematch/typed-state
```

If your project doesn't have `prop-types` package yet, you need to add it as well:

```bash npm2yarn
npm install prop-types
```

## Compatibility

Install the correct version of the typed-state plugin based on the version of the core Rematch library in your project.

|         @rematch/core  | @rematch/typed-state  |
| :--------------------: | :----: |
| 1.x.x                   |    0.1.x  |
| 2.x.x                   |    2.x.x  |

## typedStatePlugin([config])

The updated plugin accepts one optional argument - **config**, which is an object with the following properties:

- `strict` (_boolean_): if `strict` is true, we'll log a warn if some models don't contain `typings` property. Default value is `false`.

- `logSeverity` (_trace | debug | info | warn | error | fatal_): Default value is `warn`, just `console[logSeverity](message)`, if we want to throw an error you can use `fatal`.

:::tip
- If we add logSeverity `undefined` but `strict` is true, automatically will fill logSeverity to `warn`
:::

:::info
- The main difference about strict `true/false` is allowing other models to not be typed.
- **This messages are ONLY displayed on a `process.env.NODE_ENV !== 'production'`**
:::

## Usage

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
