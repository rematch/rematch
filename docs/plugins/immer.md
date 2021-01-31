---
id: immer
title: Immer
sidebar_label: "@rematch/immer"
slug: /plugins/immer/
---
import { MultiLangComponent } from "/src/components/MultiLangComponent"

Immer plugin for Rematch. Wraps your reducers with immer, providing ability to safely do mutable changes resulting in immutable state.

## Compatibility

Install the correct version of immer plugin based on the version of the core Rematch library in your project.

|         @rematch/core  | @rematch/immer  	 |
| :--------------------: | :----: 				 	 |
| 1.x.x                  |    1.x.x   			 |
| 2.x.x                  |    2.x.x   			 |

## Install

```bash npm2yarn
npm install @rematch/immer
```

## immerPlugin([config])

Immer plugin accepts one optional argument - **config**, which is an object with the following properties:

- [`whitelist`] (*string[]*): an array of models' names. Allows defining on a model level, which reducers should be wrapped with immer.
- [`blacklist`] (*string[]*): an array of models' names. Allows defining on a model level, which reducers should **not** be wrapped with immer.

If config isn't provided, reducers from all models will be wrapped with immer.

## Usage

In Immer, reducers can perform mutations to achieve the next immutable state. **Immer doesn't require that you return the next state from a reducer, but @rematch/immer plugin expects you to do it!** Your reducers must always return the next state. Otherwise, you will reset your model's state. See the example below for details.

If your state is a primitive value like a number of a string, plugin automatically avoids using immer to execute the reducer, because immer can only recognize changes to the plain objects or arrays.

<MultiLangComponent>

```js title="store.js"
import immerPlugin from '@rematch/immer'
import { init } from '@rematch/core'
import { models } from './models'

init({
  models,
	plugins: [immerPlugin()],
})
```

```ts title="store.ts"
import immerPlugin from '@rematch/immer'
import { init } from '@rematch/core'
import { models, RootModel } from './models'

export const store = init<RootModel>({
  models,
  // add immerPlugin to your store
	plugins: [immerPlugin()],
})

export type Store = typeof store
export type Dispatch = RematchDispatch<RootModel>
export type RootState = RematchRootState<RootModel>
```
</MultiLangComponent>

<MultiLangComponent>

```js
export const todo = {
	state: [
		{
			todo: 'Learn typescript',
			done: true,
		},
		{
			todo: 'Try immer',
			done: false,
		},
	],
	reducers: {
		done(state) {
      // mutable changes to the state
			state.push({ todo: 'Tweet about it' })
			state[1].done = true
			return state
		},
		// when 'reset' reducer is executed, the state will be set
		// to 'undefined' because reducer doesn't return the next state
		reset(state) {
				state[0].done = false
		},
	},
}
```

```ts
import { createModel } from '@rematch/core'
import { RootModel } from '.'

export const todo = createModel<RootModel>()({
	state: [
		{
			todo: 'Learn typescript',
			done: true,
		},
		{
			todo: 'Try immer',
			done: false,
		},
	],
	reducers: {
		done(state) {
      // mutable changes to the state
			state.push({ todo: 'Tweet about it' })
			state[1].done = true
			return state
		},
		// when 'reset' reducer is executed, the state will be set
		// to 'undefined' because reducer doesn't return the next state
		reset(state) {
				state[0].done = false
		},
	},
})
```
</MultiLangComponent>
