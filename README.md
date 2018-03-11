<img src="https://raw.githubusercontent.com/rematch/rematch/master/logo.png" alt="Rematch Logo">

<p>
<a href='https://travis-ci.org/rematch/rematch' style='margin: 0 0.5rem;'>
<img src='https://travis-ci.org/rematch/rematch.svg?branch=master' alt='Build Status' height='18'/>
</a>

<a href='https://coveralls.io/github/rematch/rematch?branch=master' style='margin: 0 0.5rem;'>
<img src='https://coveralls.io/repos/github/rematch/rematch/badge.svg?branch=master' alt='Coverage Status' height='18'/>
</a>

<a href='https://www.codacy.com/app/ShMcK/rematch?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=rematch/rematch&amp;utm_campaign=Badge_Grade' style='margin: 0 0.5rem;'>
  <img src='https://api.codacy.com/project/badge/Grade/04039822aa23402bb985d9b374ac4a39' alt='Codacy Badge' height='18'>
</a>

<a href='https://badge.fury.io/js/%40rematch%2Fcore' style='margin: 0 0.5rem;'>
<img src='https://badge.fury.io/js/%40rematch%2Fcore.svg' alt='npm version' height='18'>
</a>

<a href='https://img.shields.io/badge/size-<18kb-brightgreen.svg?style=flat' style='margin: 0 0.5rem;'>
<img src='https://img.shields.io/badge/size-<18kb-brightgreen.svg?style=flat' alt='file size' height='18'>
</a>

<a href='https://img.shields.io/badge/dependencies-redux-brightgreen.svg?style=flat' style='margin: 0 0.5rem;'>
<img src='https://img.shields.io/badge/dependencies-redux-brightgreen.svg?style=flat' alt='file size' height='18'>
</a>
</p>

# Rematch

## Rethink Redux.

Rematch is Redux best practices without the boilerplate. No more action types, action creators, switch statements or thunks. 

- [Why we created Rematch](https://hackernoon.com/redesigning-redux-b2baee8b8a38)
- [A comparison of Redux & Rematch](./docs/purpose.md)



## Index

* [Getting Started](#getting-started)
* [Purpose](./docs/purpose.md)
* [Examples](#examples)
* [Migration Guide](#migrating-from-redux)
* API Reference
  * [@rematch/core API](./docs/api.md)
  * [Init Redux API](./docs/reduxApi.md)
  * [Plugins API](./docs/pluginsApi.md)
* Recipes
  * [Devtools](./docs/recipes/devtools.md)
  * [React](./docs/recipes/react.md)
  * [Vue](./docs/recipes/vue.md)
* Plugins
  * [Subscriptions](./plugins/subscriptions/README.md)
  * [Selectors](./plugins/select/README.md)
  * [Loading](./plugins/loading/README.md)
  * [Persist](./plugins/persist/README.md)
  * [Updated](./plugins/updated/README.md)
  * [React Navigation](./plugins/react-navigation/README.md)
* [Inspiration](./docs/inspiration.md)

## Getting Started

```sh
npm install @rematch/core
```

### Step 1: Init

**init** configures your reducers, devtools & store. 

#### index.js

```js
import { init } from '@rematch/core'
import * as models from './models'

const store = init({
  models,
})
```

*For a more advanced setup, see [plugins](./docs/plugins.md) and [Redux config options](./docs/reduxApi.md).*

### Step 2: Models

The **model** brings together state, reducers, async actions & action creators in one place.

#### models.js
```js
export const count = {
  state: 0, // initial state
  reducers: {
    // handle state changes with pure functions
    increment(state, payload) {
      return state + payload
    }
  },
  effects: {
    // handle state changes with impure functions.
    // use async/await for async actions
    async incrementAsync(payload, rootState) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      this.increment(payload)
    }
  }
}
```

Understanding models is as simple as answering a few questions:

1. What is my initial state? **state**
2. How do I change the state? **reducers**
3. How do I handle async actions? **effects** with async/await

### Step 3: Dispatch

**dispatch** is how we trigger reducers & effects in your models. Dispatch standardizes your actions without the need for writing action types or action creators.

```js
import { dispatch } from '@rematch/core'
                                                  // state = { count: 0 }
// reducers
dispatch({ type: 'count/increment', payload: 1 }) // state = { count: 1 }
dispatch.count.increment(1)                       // state = { count: 2 }

// effects
dispatch({ type: 'count/incrementAsync', payload: 1 }) // state = { count: 3 } after delay
dispatch.count.incrementAsync(1)                       // state = { count: 4 } after delay
```

Dispatch can be called directly, or with the `dispatch[model][action](payload)` shorthand.


## Examples

- Count: [JS](https://codepen.io/Sh_McK/pen/BJMmXx?editors=1010) | [React](https://codesandbox.io/s/43r3wxk7x4) | [Vue](https://codesandbox.io/s/n3373olqo0) | [Angular](https://stackblitz.com/edit/rematch-angular-5-count)
- Todos: [React](https://codesandbox.io/s/43r3wxk7x4)

```jsx
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider, connect } from 'react-redux'
import { init, dispatch } from '@rematch/core'

// State

const count = {
  state: 0, // initial state
  reducers: {
    // handle state changes with pure functions
    increment(state, payload) {
      return state + payload
    }
  },
  effects: {
    // handle state changes with impure functions.
    // use async/await for async actions
    async incrementAsync(payload, rootState) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      this.increment(payload)
    }
  }
}

const store = init({
  models: {
    count
  }
})

// View

const Count = props => (
  <div>
    The count is {props.count}
    <button onClick={() => dispatch.count.increment(1)}>increment</button>
    <button onClick={() => dispatch.count.incrementAsync(1)}>incrementAsync</button>
  </div>
)

const mapState = state => ({
  count: state.count
})

const CountContainer = connect(mapState)(Count)

ReactDOM.render(
  <Provider store={store}>
    <CountContainer />
  </Provider>,
  document.getElementById('root')
)
```

## Migrating From Redux

Moving from Redux to Rematch involves very few steps.

1. Setup Rematch `init` with Redux [step 1](https://codesandbox.io/s/yw2wy1q929)
2. Mix reducers & models [step 2](https://codesandbox.io/s/9yk6rjok1r)
3. Shift to models [step 3](https://codesandbox.io/s/mym2x8m7v9)

## API

See the [@rematch/core API](./docs/api.md)

---

Like this project? ★ us on Github :)
