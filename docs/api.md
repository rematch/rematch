# @rematch/core API

```js
import { init, dispatch, getState } from '@rematch/core'
```

- [init](#init)
  - [models](#models)
    - [state](#state)
    - [reducers](#reducers)
    - [effects](#effects)
  - [plugins](#plugins)
  - [redux](#redux)
- [store](#store)
  - [dispatch](#store.dispatch)
  - [getState](#store.getstate)
  - [name](#store.name)
  - [model](#store.model)
- [action](#action)

---

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

#### state

`state: any` Required

The initial state of the model.

```js
const example = {
  state: { loading: false }
}
```

#### reducers

`reducers: { [string]: (state, payload) => any }`

An object of functions that change the model's state. These functions take the model's previous state and a payload, and return the model's next state. These should be pure functions relying only on the state and payload args to compute the next state. For code that relies on the "outside world" (impure functions like api calls, etc.), use [effects](#effects).

```js
{
  reducers: {
    add: (state, payload) => state + payload,
  }
}
```

Reducers may also listen to actions from other models by listing the 'model name' + 'action name' as the key.

```js
{
  reducers: {
    'otherModel/actionName': (state, payload) => state + payload,
  }
}
```

#### effects

`effects: { [string]: (payload, rootState) }`

An object of functions that can handle the world outside of the model. 

```js
{
  effects: {
    logState(payload, rootState) {
      console.log(rootState)
    }
  }
}
```

Effects provide a simple way of handling async actions when used with `async/await`.

```js
{
  effects: {
    async loadData(payload, rootState) {
      // wait for data to load
      const response = await fetch('http://example.com/data')
      const data = await response.json()
      // pass the result to a local reducer
      dispatch.example.update(data)
    }
  }
}
```


### plugins

```js
init({
  plugins: [loadingPlugin, persistPlugin],
})
```

Plugins are custom sets of init configurations or internal hooks that can add features to your Rematch setup.

Read more about existing [plugins](./plugins.md) or about how to create your own plugins using the [plugins API](./pluginsApi.md).

### redux

```js
init({
  redux: {
    middlewares: [reduxLogger],
    reducers: {
      someReducer: (state, action) => ...,
    }
  },
})
```

There are situations where you might want to access Redux directly. You may want to:

- migrate an existing Redux project
- add middleware
- create a custom plugin

For a complete summary of all redux options, see the [init Redux API](./reduxApi.md).

---

## store

### store.dispatch

As in Redux, a function that dispatches an [action](#action).

In Rematch, `store.dispatch` can be called directly or as an object.

```js
import store from './index'

const { dispatch } = store
                                                  // state = { count: 0 }
// reducers
dispatch({ type: 'count/increment', payload: 1 }) // state = { count: 1 }
dispatch.count.increment(1)                       // state = { count: 2 }

// effects
dispatch({ type: 'count/incrementAsync', payload: 1 }) // state = { count: 3 } after delay
dispatch.count.incrementAsync(1)                       // state = { count: 4 } after delay
```

Dispatch has an optional second property, "meta", which can be used in subscriptions or middleware. This is for advanced use cases only.

`dispatch.count.increment(2, { syncWithServer: true })`

### store.getState

As in Redux, returns the state of a store.

### store.name

Provide a name for your store.

Use this when using multiple stores. The name will become the key when global `getState` is called.

### store.model

It's possible to lazy-load models and merge them into Rematch after `init` has been called. Use `store.model`.


```js
import { init } from '@rematch/core'

const store = init({
  models: {
    count: { state: 0 }
  }
})

store.getState()
// { count: 0 }


// later on
store.model({ name: 'countB', state: 99 })

store.getState()
// { count: 0, countB: state: 99 }
```

---

## action

`{ type: 'modelName/actionName', payload: any }`

Actions are messages sent within Redux as a way for disparate parts of your app to communicate state updates.

In Rematch, an action is always structured with a type of "modelName" and "actionName" - referring to either a reducer or effect name.

Any data attached to an action is added in the payload.

