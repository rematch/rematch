---
id: loading
title: Loading
sidebar_label: '@rematch/loading'
slug: /plugins/loading/
---

```twoslash include countModel
// @filename: count.ts
import { createModel } from '@rematch/core'
import { RootModel } from "./models"

export const count = createModel<RootModel>()({
	state: 0,
	reducers: {
		increment(state, payload: number) {
			return state + payload
		},
	},
	effects: (dispatch) => ({
		async incrementAsync(payload: number, state) {
			dispatch.count.increment(payload)
		},
	}),
})
```

```twoslash include rootModel
// @filename: models.ts
import { Models } from "@rematch/core"
import { count } from "./count"

export interface RootModel extends Models<RootModel> {
  count: typeof count
}

export const models: RootModel = { count }
```

```twoslash include store
// @filename: store.ts
import loadingPlugin, { ExtraModelsFromLoading } from "@rematch/loading"
import { init, RematchDispatch, RematchRootState } from "@rematch/core"
import { models, RootModel } from "./models"

type FullModel = ExtraModelsFromLoading<RootModel>

export const store = init<RootModel, FullModel>({
  models,
  plugins: [loadingPlugin()],
})

export type Store = typeof store
export type Dispatch = RematchDispatch<RootModel>
export type RootState = RematchRootState<RootModel, FullModel>
```

```twoslash include storeAsNumber
// @filename: storeAsNumber.ts
import loadingPlugin, { ExtraModelsFromLoading } from "@rematch/loading"
import { init, RematchDispatch, RematchRootState } from "@rematch/core"
import { models, RootModel } from "./models"

type FullModel = ExtraModelsFromLoading<RootModel, { type: 'number' }>

export const store = init<RootModel, FullModel>({
  models,
  plugins: [loadingPlugin({ type: 'number' })],
})

export type Store = typeof store
export type Dispatch = RematchDispatch<RootModel>
export type RootState = RematchRootState<RootModel, FullModel>
```

```twoslash include storeAsFull
// @filename: storeAsFull.ts
import loadingPlugin, { ExtraModelsFromLoading } from "@rematch/loading"
import { init, RematchDispatch, RematchRootState } from "@rematch/core"
import { models, RootModel } from "./models"

type FullModel = ExtraModelsFromLoading<RootModel, { type: 'full' }>

export const store = init<RootModel, FullModel>({
  models,
  plugins: [loadingPlugin({ type: 'full' })],
})

export type Store = typeof store
export type Dispatch = RematchDispatch<RootModel>
export type RootState = RematchRootState<RootModel, FullModel>
```

The loading plugin for Rematch. Adds automated loading indicators for effects, so you don't need to manage state like `loading: true` by yourself. Inspired by [dva-loading](https://github.com/dvajs/dva/tree/master/packages/dva-loading).

## Compatibility

Install the correct version of loading plugin based on the version of the core Rematch library in your project.

| @rematch/core | @rematch/loading |
| :-----------: | :--------------: |
|     1.x.x     |      1.x.x       |
|     2.x.x     |      2.x.x       |

## Install

```bash npm2yarn
npm install @rematch/loading
```

## loadingPlugin([config])

The loading plugin accepts one optional argument - **config**, which is an object with the following properties:

- [`name`] (_string?_): key for the loading model in your store. If you name it "custom", loading state can be accessed from _state.custom_. **Defaults to _loading_**.
- [`asNumber`] (_boolean?_): loading plugin by default keeps track of running effects using booleans, so for example: _state.loading.global === true_. You can change that behaviour and use numbers instead - plugin will keep track of the number of times an effect was executed, for example: _state.loading.global === 5_. Defaults to _false_. **Deprecated, use `type` instead**
- [`type`] (_"number"|"boolean"|"full"_): Loading plugin by default keeps track of running effects using booleans, but sometimes you want to track if the effect promise is resolved to an Error, or loading, or if the promise is resolved correctly, in that case you can use `full`. If you want to track the number of times an effect was executed, you can use `number` instead.
- [`whitelist`] (_string[]?_): an array of effects names that you want to use loading plugin for. If defined, plugin will work only for the whitelisted effects.
- [`blacklist`] (_string[]?_): an array of effects names that you **don't want** to use loading plugin for. If defined, plugin will work for all effects except those blacklisted.

Both `blacklist` and `whitelist` accept the "full" effect name, in a format `modelName/effectFunctionName`, for example _'count/addOne'_.

If both `blacklist` and `whitelist` aren't provided, plugin works for all effects.

## Usage

Let's say we have a model 'count' in our store. Loading plugin's state will have the following format:

```json
{
	"global": true, // true when any effect in any model is loading
	"models": {
		"count": true // true when any effect in 'count' model is loading
	},
	"effects": {
		"count": {
			"addOne": true // true when effect 'addOne' in model 'count' is loading
		}
	}
}
```

Check out below an example of how to use loading plugin in React:

Set up your store with default or custom settings.

### Setup the store

```ts twoslash {2,6,8,10,15} title="store.ts"
// @include: countModel
// @include: rootModel
// ---cut---
// @include: store
```

If you want to use the `loadingPlugin` with numbers instead of booleans, you can also change the typings:

```ts twoslash {2,6,8,10,15}
// @include: countModel
// @include: rootModel
// ---cut---
// @include: storeAsNumber
```

If you want to use the `loadingPlugin` with detailed Errors and Success information instead of booleans, you can also change the typings:

```ts twoslash {2,6,8,10,15}
// @include: countModel
// @include: rootModel
// ---cut---
// @include: storeAsFull
```

### React usage

Use state created by the loading plugin in your view.

#### Default

```tsx twoslash
// @include: countModel
// @include: rootModel
// @include: store
// ---cut---
// @filename: appTemplate.tsx
import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from './store'

export const App = () => {
	const isCountLoading = useSelector(
		(rootState: RootState) => rootState.loading.models.count
	)
	if (isCountLoading) return <div>LOADING...</div>

	return <div>Data succesfully loaded</div>
}
```

#### Full

```tsx twoslash
// @include: countModel
// @include: rootModel
// @include: storeAsFull
// ---cut---
// @filename: appTemplate.tsx
import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from './storeAsFull'

export const App = () => {
	const { loading, success, error } = useSelector(
		(rootState: RootState) => rootState.loading.models.count
	)
	if (loading) return <div>LOADING...</div>
	if (error) return <div>{(error as Error).name}</div>

	return <div>Data succesfully loaded</div>
}
```

#### Number

```tsx twoslash
// @include: countModel
// @include: rootModel
// @include: storeAsNumber
// ---cut---
// @filename: appTemplate.tsx
import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from './storeAsNumber'

export const App = () => {
	const countCalledTimes = useSelector(
		(rootState: RootState) => rootState.loading.models.count
	)
	if (countCalledTimes > 0) return <div>LOADING...</div>

	return <div>Data succesfully loaded</div>
}
```
