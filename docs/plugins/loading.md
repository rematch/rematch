---
id: loading
title: Loading
sidebar_label: "@rematch/loading"
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

type FullModel = ExtraModelsFromLoading<RootModel, { asNumber: true }>

export const store = init<RootModel, FullModel>({
  models,
  plugins: [loadingPlugin({ asNumber: true })],
})

export type Store = typeof store
export type Dispatch = RematchDispatch<RootModel>
export type RootState = RematchRootState<RootModel, FullModel>
```

The loading plugin for Rematch. Adds automated loading indicators for effects, so you don't need to manage state like `loading: true` by yourself. Inspired by [dva-loading](https://github.com/dvajs/dva/tree/master/packages/dva-loading).

## Compatibility

Install the correct version of loading plugin based on the version of the core Rematch library in your project.

| @rematch/core | @rematch/immer |
| :-----------: | :------------: |
|     1.x.x     |     1.x.x      |
|     2.x.x     |     2.x.x      |

## Install

```bash npm2yarn
npm install @rematch/loading
```

## loadingPlugin([config])

The loading plugin accepts one optional argument - **config**, which is an object with the following properties:

- [`name`] (_string?_): key for the loading model in your store. If you name it "custom", loading state can be accessed from _state.custom_. **Defaults to _loading_**.
- [`asNumber`] (_boolean?_): loading plugin by default keeps track of running effects using booleans, so for example: _state.loading.global === true_. You can change that behaviour and use numbers instead - plugin will keep track of the number of times an effect was executed, for example: _state.loading.global === 5_. Defaults to _false_.
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

```ts twoslash {1,5,7,9} title="store.ts"
// @include: countModel
// @include: rootModel
// ---cut---
// @include: store
```

If you want to use the `loadingPlugin` with numbers instead of booleans, you can also change the typings:

```ts twoslash {1,5,7,9}
// @include: countModel
// @include: rootModel
// ---cut---
// @include: storeAsNumber
```

### Use in the view

Use state created by the loading plugin in your view.

```twoslash include appTemplate
// @filename: appTemplate.tsx
import React from "react"
import { useSelector } from "react-redux"
import { RootState } from "./store"

export const App = () => {
  const isCountLoading = useSelector((rootState: RootState) => rootState.loading.models.count)
  if (isCountLoading) return <div>LOADING...</div>

  return (
    <div>
      Data succesfully loaded
    </div>
  )
}
```

```tsx twoslash
// @include: countModel
// @include: rootModel
// @include: store
// ---cut---
// @include: appTemplate
```
