# @rematch/core API

- [init](api-reference/api#init)
  - [models](api-reference/api#models)
    - [state](api-reference/api#state)
    - [reducers](api-reference/api#reducers)
    - [effects](api-reference/api#effects)
    - [basereducer](api-reference/api#basereducer)
  - [plugins](api-reference/api#plugins)
  - [redux](api-reference/api#redux)
- [store](api-reference/api#store)
  - [dispatch](api-reference/api#storedispatch)
  - [getState](api-reference/api#storegetstate)
  - [name](api-reference/api#storename)
  - [model](api-reference/api#storemodel)
- [action](api-reference/api#action)

## init

`init(config)`

The function called to setup Rematch. Returns `store`.

```javascript
import { init } from '@rematch/core'

const store = init()
```

Init may also be called with the following configuration option below.

### models

`init({ models: { [string]: model } })`

```javascript
import { init } from '@rematch/core'

const count = {
	state: 0,
}

init({
	models: {
		count,
	},
})
```

For smaller projects, its recommend you keep your models in a "models.js" file and named export them.

```javascript
export const count = {
	state: 0,
}
```

For larger projects, its recommended you keep your models in a "models" folder and export them.

```javascript
// models/count.js
export default {
	state: 0,
}
```

```javascript
// models/index.js
export { default as count } from './count'
export { default as settings } from './settings'
```

These can then be imported using `* as alias` syntax.

```javascript
import { init } from '@rematch/core'
import * as models from './models'

init({ models })
```

#### state

`state: any` Required

The initial state of the model.

```javascript
const example = {
	state: { loading: false },
}
```

#### reducers

`reducers: { [string]: (state, payload) => any }`

An object of functions that change the model's state. These functions take the model's previous state and a payload, and return the model's next state. These should be pure functions relying only on the state and payload args to compute the next state. For code that relies on the "outside world" \(impure functions like api calls, etc.\), use [effects](api.md#effects).

```javascript
{
  reducers: {
    add: (state, payload) => state + payload,
  }
}
```

Reducers may also listen to actions from other models by listing the 'model name' + 'action name' as the key.

```javascript
{
  reducers: {
    'otherModel/actionName': (state, payload) => state + payload,
  }
}
```

#### effects

`effects: { [string]: (payload, rootState) }`

An object of functions that can handle the world outside of the model.

```javascript
{
  effects: {
    logState(payload, rootState) {
      console.log(rootState)
    }
  }
}
```

Effects provide a simple way of handling async actions when used with `async/await`.

```javascript
{
  effects: {
    async loadData(payload, rootState) {
      // wait for data to load
      const response = await fetch('http://example.com/data')
      const data = await response.json()
      // pass the result to a local reducer
      this.update(data)
    }
  },
  reducers: {
    update(prev, data) {
      return {...prev, ...data}
    }
  }
}
```

`effects` may also be declared as a factory. This way provides the ability to dispatch external model actions.

```javascript
{
	effects: dispatch => ({
		async loadData(payload, rootState) {
			// wait for data to load
			const response = await fetch('http://example.com/data')
			const data = await response.json()
			// pass the result to a external model reducer
			dispatch.other.update(data)
		},
	})
}
```

`effects` that share a name with a reducer are called **after** their reducer counterpart

```js
{
  effects: {
    // this will run after "update" reducer finished
    update(payload, rootState) {
      console.log('update reducer was called with payload: ', payload);
    }
  },
  reducers: {
    update(prev, data) {
      return {...prev, ...data}
    }
  }
}
```

#### baseReducer

`baseReducer: (state, action) => state`

A reducer that will run before the model's `reducers`. This function takes the model's previous state and an action, and returns the model state that `reducers` will use.

This is especially useful for adding redux libraries to your store in a structured manner. See the recipe for [redux plugins](https://github.com/rematch/rematch/tree/e4fe17537a947bbe8a9faf1e0e77099beb7fef91/docs/recipes/redux.md)

### plugins

```javascript
init({
	plugins: [loadingPlugin, persistPlugin],
})
```

Plugins are custom sets of init configurations or internal hooks that can add features to your Rematch setup.

Read more about existing [plugins](https://github.com/rematch/rematch/tree/e4fe17537a947bbe8a9faf1e0e77099beb7fef91/docs/plugins.md) or about how to create your own plugins using the [plugins API](pluginsapi.md).

### redux

```javascript
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

For a complete summary of all redux options, see the [init Redux API](./api-reference/reduxapi.md).

## store

### store.dispatch

As in Redux, a function that dispatches an [action](api.md#action).

In Rematch, `store.dispatch` can be called directly or as an object.

```javascript
import store from './index'

const { dispatch } = store
// state = { count: 0 }
// reducers
dispatch({ type: 'count/increment', payload: 1 }) // state = { count: 1 }
dispatch.count.increment(1) // state = { count: 2 }

// effects
dispatch({ type: 'count/incrementAsync', payload: 1 }) // state = { count: 3 } after delay
dispatch.count.incrementAsync(1) // state = { count: 4 } after delay
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

```javascript
import { init } from '@rematch/core'

const store = init({
	models: {
		count: { state: 0 },
	},
})

store.getState()
// { count: 0 }

// later on
store.model({ name: 'countB', state: 99 })

store.getState()
// { count: 0, countB: 99 }
```

## action

`{ type: 'modelName/actionName', payload: any }`

Actions are messages sent within Redux as a way for disparate parts of your app to communicate state updates.

In Rematch, an action is always structured with a type of "modelName" and "actionName" - referring to either a reducer or effect name.

Any data attached to an action is added in the payload.
