# API Reference

- [action](#action)
- [dispatch](#dispatch)
- [model](#model)
  - [name](#name)
  - [state](#state)
  - [reducers](#reducers)
  - [effects](#effects)
  - [selectors](#selectors)
  - [subscriptions](#subscriptions)
- [init](#init)
  - [models](#models)
  - [initialState](#initialState)
  - [plugins](#plugins)
  - [extraReducers](#extraReducers)
  - [overwrites](#overwrites)
    - [combineReducers](#combineReducers)
    - [createStore](#createStore)
  - [devtoolOptions](#devtoolOptions)
- [getStore](#getStore)

## action

`{ type: 'modelName/actionName', payload: any }`

Actions are messages sent within Redux as a way for disparate parts of your app to communicate state updates.

In Rematch, an action is always structured with a type of "modelName" and "actionName" - referring to either a reducer or effect name.

Any data attached to an action is added in the payload.

## dispatch

`dispatch(action)`

A dispatch sends an [action](#action)

`dispatch.modelName.actionName(any)`

In Rematch, its more common to use the shorthand above, which will create and structure an action for you.

Dispatch can be called anywhere within your app.

```js
import { dispatch } from '@rematch/core'

dispatch.cart.addToCart(item)
```


## model

Models organize related code into modules.

Learn more about how to initialize models under [`init.models`](#models).

### name

`name: string` Required

The name of your model. Also used as the key referencing the models state.

```js
{
  name: 'example',
}
```

### state

`state: any` Required

The initial state of the model.

```js
{
  name: 'example',
  state: { loading: false }
}
```

The above example would produce the initial state of `{ example: { loading: false } }`.

### reducers

`reducers: { [string]: (state, payload) => any }`

An object of pure named pure functions that can change state.

```js
{
  reducers: {
    add: (state, payload) => state + payload,
  }
}
```

### effects

`effects: { [string]: (payload, { getState, dispatch, select }) }`

An object of functions that can handle the world outside of the model. 

```js
{
  effects: {
    logState(payload, { getState }) {
      const state = getState()
      console.log(state)
    }
  }
}
```

Effects provide a simple way of handling async actions when used with `async/await`.

```js
{
  effects: {
    async loadData(payload, { dispatch }) {
      // wait for data to load
      const response = await fetch('http://example.com/data')
      const data = response.json()
      // pass the result to a local reducer
      dispatch.example.update(data)
    }
  }
}
```

### selectors

`selectors: { [string]: (state, ...params) => any }`

Selectors are read-only snippets of state.

```js
{
  name: 'cart',
  state: [{
    price: 42.00,
    amount: 3,
  }],
  selectors: {
    total(state) {
      return state.reduce((a, b) => a + (b.price * b.amount), 0)
    }
  }
}
```

> note: selector state does not refer to the complete state, only the state within the model

Selectors can be called anywhere within your app.

```js
import { select, getState } from '@rematch/core'

select.cart.total(getState())
```

Selectors can also be used with memoization libraries like [reselect](https://github.com/reactjs/reselect).

```js
import { createSelector } from 'reselect'

{
  selectors: {
    total: createSelector(
      state => state.reduce((a, b) => a + (b.price * b.amount), 0)
    )
  }
}
```

### subscriptions

`subscriptions: { [string]: (action, unsubscribe) => any }`

Subscriptions are way for models to listen to changes in the app. 

```js
{
  name: 'settings',
  state: {},
  reducers: {
    set: (payload) => payload
  },
  subscriptions: {
    'profile/load': (action) => {
      dispatch.settings.set(action.payload)
    }
  }
}
```

Subscriptions help you make isolated models that know nothing about their neighbours.

Use `unsubscribe` if you'd like an action to fire only once.

```js
{
  name: 'settings',
  state: {},
  reducers: {
    set: (payload) => payload
  },
  subscriptions: {
    'profile/load': (action, unsubscribe) => {
      dispatch.settings.set(action.payload)
      unsubscribe()
    }
  }
}
```

Subscriptions can also use pattern matching. Bear in mind, that the pattern should avoid matching any actions within your model to prevent an infinite loop.

```js
{
  subscriptions: {
    'routeChange/*': (action) => console.log(action)
  }
}
```

The following patterns are all valid:

```
modelName/actionName
*/actionName
modelName/*
a-*/b
a/b-*
```

If possible, pattern matching should be avoided as it can effect performance.

## init

`init(config)`

The function called to setup Rematch.

```js
import { init } from '@rematch/core'

init()
```

Init may also be called with the following configuration option below.

### models

`init({ models: { [string]: model } })`

Its recommend to load your model on startup.

```js
import { init } from '@rematch/core'

const count = {
  name: 'count',
  state: 0,
}

init({
  models: {
    count
  }
})
```

For larger projects, its recommended you keep your models in a "models" folder and export them.

```js
// models/count.js
export default {
  name: 'count',
  state: 0,
}
```

```js
// models/index.js
export { default as count } from './count'
export { default as settings } from './settings'
```

These can then be imported using `* as alias` syntax.

```js
import { init } from '@rematch/core'
import * as models from './models'

init({ models })
```

It's also possible, though not recommended, to lazy-load models and merge them into Rematch.

```js
import { model } from '@rematch/core'

model({
  name: 'count',
  state: 0,
})
```

### initialState

`init({ initialState: any })`

The initialState of your app. This is likely not nececssary, as the state of your models will overwrite the initial state.

## getStore

`function`

Provides access to the Redux store.

```js
import { getStore } from '@rematch/core'

getStore() // store
```

### plugins

```js
init({
  plugins: [loadingPlugin, persistPlugin],
})
```

Plugins are custom sets of init configurations or internal hooks that can add features to your Rematch setup.

Read more about existing [plugins](./plugins) or about how to create your own plugins using the [plugins API](./pluginsAPI).

### extraReducers

```js
init({
  extraReducers: {
    nav: navReducer,
  }
})
```

Allows passing in of reducer functions, rather than models. While not recommended, this can be used for migrating a Redux codebase or configuring different Redux extensions.

### overwrites

Provides access for overwriting Redux core.

#### combineReducers

```js
init({
  overwrites: {
    combineReducers: customCombineReducers
  }
})
```

Allows access to overwrite Redux's `combineReducers` method. Currently necessary for setting up Redux persist v5.


#### createStore

```js
init({
  overwrites: {
    createStore: customCreateStore
  }
})
```

Allows access to overwrite Redux's `createStore` method. Currently necessary for setting up Reactotron with Redux.

### devtoolOptions

Provides access to [redux devtool options]((https://github.com/zalmoxisus/redux-devtools-extension/blob/master/docs/API/Arguments.md)) Read more about configuring devtools under [devtool recipes](./recipes/devtools).