# Rematch Subscriptions

Subscriptions plugin for Rematch.

### Install

```
npm install @rematch/subscriptions
```

### Setup

```js
import subscriptionsPlugin from '@rematch/subscriptions'
import { init } from '@rematch/core'

const subscriptions = subscriptionsPlugin()

init({
  plugins: [subscriptions]
})
```

### Subscriptions

`subscriptions: { [string]: (action, state, unsubscribe) => any }`

Subscriptions are way for models to listen to changes in the app. 

```js
{
  name: 'settings',
  state: {},
  reducers: {
    set: (payload) => payload
  },
  subscriptions: {
    'profile/load': (action, state, unsubscribe) => {
      dispatch.settings.set(action.payload)
    }
  }
}
```

In this case, subscriptions avoid the need of coupling the auth model to the profile model. Profile simply listens to an action.

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
    'profile/load': (action, state, unsubscribe) => {
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

