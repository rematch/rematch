# Rematch

<p>
<a href='https://travis-ci.org/rematch/rematch' style='margin: 0 0.5rem;'>
<img src='https://travis-ci.org/rematch/rematch.svg?branch=master' alt='Build Status'/>
</a>

<a href='https://coveralls.io/github/rematch/rematch?branch=master&service=github' style='margin: 0 0.5rem;'>
<img src='https://coveralls.io/repos/github/rematch/rematch/badge.svg?branch=master&service=github' alt='Coverage Status' />
</a>

<a href='https://badge.fury.io/js/%40rematch%2Fcore' style='margin: 0 0.5rem;'>
<img src='https://badge.fury.io/js/%40rematch%2Fcore.svg' alt='npm version' height='18'>
</a>
</p>

> Rethink Redux.

## Purpose

Rematch is Redux best practices without the boilerplate. Rematch removes the need for action types, action creators, switch statements & thunks. [See a comparison of the two](./docs/purpose.md)

## Installation

```js
npm install @rematch/core
```

## API

See the [API Reference](./docs/api.md).


## WalkThrough

In Redux, the state of your whole application is stored in an object tree within a single store.

In Rematch, we refer to the top level keys of that state tree as models.

### Models

When you build your apps, you are designing these models. To design these models, you should answer these questions:

1. What's the state key name of this model? **name**
2. What does it's initial state look like? **state**
3. In which ways do I change the state? **reducers**

#### Level 1

```js
import { init } from '@rematch/core'

const count = {
  name: 'count',
  state: 0,
  reducers: {
    addOne: (state) => state + 1,
    addBy: (state, payload) => state + payload
  }
}

init({
  models: { count }
})
```

### Dispatch

Dispatch, as in Redux, is the way of sending actions that your models listens for. Dispatch can be accessed globally anywhere in your app.

By default, Rematch listens for state changes of `${model.name}/${action.name}`.

```js
import { dispatch } from '@rematch/core'

dispatch({ type: 'count/addOne' })
// state is now { count: 1 }

dispatch({ type: 'count/addBy', payload: 2 })
// state is { count: 3 }
```

There is a helpful shorthand for writing dispatches that avoids the need for action types & action creators.

```js
dispatch.count.addOne()
// { count: 4 }

dispatch.count.addBy(5)
// { count: 9 }
```

### Effects

Not all actions are the same. In fact, categorizing actions by their purpose enables helpful patterns and plugins. Consider the following:

How do I change the state? **reducers**
How do I handle async actions? **effects**

#### Level 2: Effects

```js
const auth = {
  name: 'auth',
  state: {
    token: null,
  },
  reducers: {
    setToken: (state, payload) => {
      token: payload
    },
  },
  effects: {
    async login(payload, { dispatch ) {
      const token = await fetch('somesite.com', {
        body: {
          email: payload.email,
          password: payload.password,
        },
      }
      dispatch.auth.setToken(token)
    }
  }
}
```

Note that effects are dispatched in the same way as reducers.


### Select

Once you've implemented your models, Rematch makes it easy to access values from the models' state from anywhere in your app

#### Level 3: Selectors

```js
const cart = {
  name: 'cart',
  state: [
    { item: 'tooth brush', price: 4.00, amount: 1 },
    { item: 'tooth paste', price: 7.50, amount: 2 },
  ],
  selectors: {
    total(cart) {
      return cart.reduce((a, b) => {
        a += b.price * b.amount
      }, 0)
    }
  }
}
```

Selectors can be accessed anywhere in your app using the `select`. You'll need to pass in state.

```js
import { select } from '@rematch/core'

connect(state => {
  total: select.cart.total(state)
})
```

### Subscriptions

Subscriptions provide an easy way to listen for different dispatched actions. This is similar to how "take" and "takeEvery" are used in Redux Saga. There are helpful for a few reasons:

- triggering another action when something happens
- isolating your models from each other

#### Level 4: Subscriptions

```js
const profile = {
  name: 'profile',
  state: {
    userId: null,
  },
  subscriptions: {
    'auth/login': (action, unsubscribe) => {
      dispatch.profile.loadProfile()
    }
  }
}
```

In this case, subscriptions avoid the need of coupling the auth model to the profile model. Profile simply listens to an action.

## Plugins

Rematch is built around a plugin pipeline, making it easy to use or create your own plugins. Take a look at some examples:

- [loading](./plugins/loading)
- [persist](./plugins/persist)
- [react-navigation](./plugins/react-navigation)

## Inspiration

Refining the ideas of [Dva](github.com/dvajs/dva) & [Mirror](https://github.com/mirrorjs/mirror). Read more about what makes rematch different [here](./docs/inspiration.md).