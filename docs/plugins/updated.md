---
id: updated
title: Updated
sidebar_label: "@rematch/updated"
slug: /plugins/updated/
---
import { MultiLangComponent } from "/src/components/MultiLangComponent"

Rematch plugin for maintaining timestamps when an effect is triggered.

Updated is primarily used for optimizing effects. It can be used to:

- prevent expensive fetch requests within a certain time period
- throttle effects

## Compatibility

Install the correct version of the updated plugin based on the version of the core Rematch library in your project.

|         @rematch/core  | @rematch/updated  |
| :--------------------: | :----: |
| 1.x.x                   |    1.x.x  |
| 2.x.x                   |    2.x.x  |

## Install

```bash npm2yarn
npm install @rematch/updated
```

## updatedPlugin([config])

The updated plugin accepts one optional argument - **config**, which is an object with the following properties:

- `name` (_string_): the key for the updated state. Default value is `updated`.

- `blacklist` (_string[]_): list of blacklisted **model** names, for which the plugin will not track effects

- `dateCreator` (_() => any_): by default it's a function which returns new Date object when an effect is called. However, if you prefer to use moment or any other custom library, you can provide a custom implementation, such as `() => moment()`.

## Usage

Let’s say we have a model ‘count’ in our store which has two effects - _fetchOne_ and _fetchTwo_. Updated plugin’s state will have the following format:

```js
{
  "count": {
    "fetchOne": "2020-12-13T20:48:34.935Z", // Date when fetchOne effect was last fetched
    "fetchTwo": "2020-12-13T20:40:34.935Z" , // Date when fetchTwo effect was last fetched
  }
}
```

### Setup the store
To use the plugin, start with adding it to your store:

<MultiLangComponent>

```js title="store.js"
import updatedPlugin from '@rematch/updated'
import { init } from '@rematch/core'
import * as models from './models'

init({
    models,
	plugins: [updatedPlugin()],
})
```

```ts title="store.ts"
import updatedPlugin, { ExtraModelsFromUpdated } from '@rematch/loading'
import { init, RematchDispatch, RematchRootState } from '@rematch/core'
import { models, RootModel } from './models'

type FullModel =  ExtraModelsFromUpdated<RootModel>

// Also you can use loading plugin
// type FullModel =  ExtraModelsFromLoading<RootModel> & ExtraModelsFromUpdated<RootModel>

export const store = init<RootModel, FullModel>({
    models,
	  plugins: [updatedPlugin()],
})

export type Store = typeof store
export type Dispatch = RematchDispatch<RootModel>
export type RootState = RematchRootState<RootModel, FullModel>
```

</MultiLangComponent>

### Use in the view

Define a model which uses effects.

```js title="some-model.js"
export const count = {
	...,
    effects: {
      async fetchOne() {},
      async fetchTwo() {},
    }
}
```

Use the updated state:

```js title="someView.jsx"
const state = store.getState()
// or just connect() on `react-redux`

console.log(state.updated.count.fetchOne)
console.log(state.updated.count.fetchTwo)
```