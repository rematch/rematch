# API Reference

- [dispatch](#dispatch)
  - [action](#action)
- [model](#model)
  - [state](#state)
  - [reducers](#reducers)
  - [effects](#effects)
- [init](#init)
  - [models](#models)
  - [initialState](#initialState)
  - [plugins](#plugins)
  - [redux](./initReduxApi.md)


## dispatch

`dispatch(action, meta)`

A dispatch sends an [action](#action)

`dispatch.modelName.actionName(any)`

In Rematch, its more common to use the shorthand above, which will create and structure an action for you.

Dispatch can be called anywhere within your app.

```js
import { dispatch } from '@rematch/core'

dispatch.cart.addToCart(item)
```

Dispatch has an optional second property, "meta", which can be used in subscriptions or middleware. This is for advanced use cases only.

`dispatch.cart.addToCart(item, { syncWithServer: true })`

### action

`{ type: 'modelName/actionName', payload: any }`

Actions are messages sent within Redux as a way for disparate parts of your app to communicate state updates.

In Rematch, an action is always structured with a type of "modelName" and "actionName" - referring to either a reducer or effect name.

Any data attached to an action is added in the payload.


## model

Models organize related code into modules.

Learn more about how to initialize models under [`init.models`](#models).

### state

`state: any` Required

The initial state of the model.

```js
const example = {
  state: { loading: false }
}
```

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

`effects: { [string]: (payload, state) }`

An object of functions that can handle the world outside of the model. 

```js
{
  effects: {
    logState(payload, state) {
      console.log(state)
    }
  }
}
```

Effects provide a simple way of handling async actions when used with `async/await`.

```js
{
  effects: {
    async loadData(payload, state) {
      // wait for data to load
      const response = await fetch('http://example.com/data')
      const data = response.json()
      // pass the result to a local reducer
      dispatch.example.update(data)
    }
  }
}
```

## init

`init(config)`

The function called to setup Rematch. Returns `store`.

```js
import { init } from '@rematch/core'

const store = init()
```

Init may also be called with the following configuration option below.

### models

`init({ models: { [string]: model } })`

Its recommend to load your model on startup.

```js
import { init } from '@rematch/core'

const count = {
  state: 0,
}

init({
  models: {
    count
  }
})
```

For smaller projects, its recommend you keep your models in a "models.js" file and named export them.

```js
export const count = {
  state: 0,
}
```

For larger projects, its recommended you keep your models in a "models" folder and export them.

```js
// models/count.js
export default {
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

### plugins

```js
init({
  plugins: [loadingPlugin, persistPlugin],
})
```

Plugins are custom sets of init configurations or internal hooks that can add features to your Rematch setup.

Read more about existing [plugins](./plugins) or about how to create your own plugins using the [plugins API](./pluginsAPI).

### Init Redux (continued)

There are situations where you might want to access Redux directly. You may want to:

- migrate an existing Redux project
- add middleware
- create a custom plugin

For a complete summary of all redux options, see the [init Redux API](./initReduxApi.md).
