<img src="./logo/rematch-logo.svg" height='250' width='250' alt="Rematch Logo">

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

<a href='https://img.shields.io/badge/bundlesize-~5kb-brightgreen.svg?style=flat' style='margin: 0 0.5rem;'>
<img src='https://img.shields.io/badge/bundlesize-~5kb-brightgreen.svg?style=flat' alt='bundle size' height='18'>
</a>

<a href='https://img.shields.io/badge/dependencies-redux-brightgreen.svg?style=flat' style='margin: 0 0.5rem;'>
<img src='https://img.shields.io/badge/dependencies-redux-brightgreen.svg?style=flat' alt='file size' height='18'>
</a>
</p>

# Rematch

## Rethink Redux.

Rematch is Redux best practices without the boilerplate. No more action types, action creators, switch statements or thunks.

- [Why we created Rematch](https://hackernoon.com/redesigning-redux-b2baee8b8a38)
- [Video: Introducing Rematch](https://www.youtube.com/watch?v=3ezSBYoL5do)
- [A comparison of Redux & Rematch](./docs/purpose.md)

## Index

* [Getting Started](#getting-started)
* [Purpose](./docs/purpose.md)
* [Examples](#examples)
* [Migration Guide](#migrating-from-redux)
* API Reference
  * [Core API](./docs/api.md)
  * [Init Redux API](./docs/reduxApi.md)
  * [Plugins API](./docs/pluginsApi.md)
* Recipes
  * [Devtools](./docs/recipes/devtools.md)
  * [React](./docs/recipes/react.md)
  * [Vue](./docs/recipes/vue.md)
  * [Testing](./docs/recipes/testing.md)
  * [TypeScript](./docs/recipes/typescript.md)
  * [Immer](./docs/recipes/immer.md)
  * [Decoupling reducers](./docs/recipes/decouplingReducers.md)
* Plugins
  * [Selectors](./plugins/select/README.md)
  * [Loading](./plugins/loading/README.md)
  * [Persist](./plugins/persist/README.md)
  * [Updated](./plugins/updated/README.md)
  * [React Navigation](./plugins/react-navigation/README.md)
  * [Immer](./plugins/immer/README.md)
* [Inspiration](./docs/inspiration.md)

##### Translations
* [中文手册](https://rematch.gitbook.io/handbook)

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

export default store
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
  effects: (dispatch) => ({
    // handle state changes with impure functions.
    // use async/await for async actions
    async incrementAsync(payload, rootState) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      dispatch.count.increment(payload)
    }
  })
}
```

*See the [reducers docs](https://github.com/rematch/rematch/blob/master/docs/api.md#reducers) to learn more, including how to trigger actions from other models.*

Understanding models is as simple as answering a few questions:

1. What is my initial state? **state**
2. How do I change the state? **reducers**
3. How do I handle async actions? **effects** with async/await

### Step 3: Dispatch

**dispatch** is how we trigger reducers & effects in your models. Dispatch standardizes your actions without the need for writing action types or action creators.

```js
import { init } from '@rematch/core'
import * as models from './models'

const store = init({
  models,
})

export const { dispatch } = store
                                                  // state = { count: 0 }
// reducers
dispatch({ type: 'count/increment', payload: 1 }) // state = { count: 1 }
dispatch.count.increment(1)                       // state = { count: 2 }

// effects
dispatch({ type: 'count/incrementAsync', payload: 1 }) // state = { count: 3 } after delay
dispatch.count.incrementAsync(1)                       // state = { count: 4 } after delay
```

Dispatch can be called directly, or with the `dispatch[model][action](payload)` shorthand.


### Step 4: View

Rematch can be used with native redux integrations such as "react-redux". See an example below.

```jsx
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider, connect } from 'react-redux'
import store from './store'

const Count = props => (
  <div>
    The count is {props.count}
    <button onClick={props.increment}>increment</button>
    <button onClick={props.incrementAsync}>incrementAsync</button>
  </div>
)

const mapState = state => ({
  count: state.count
})

const mapDispatch = ({ count: { increment, incrementAsync }}) => ({
  increment: () => increment(1),
  incrementAsync: () => incrementAsync(1)
})

const CountContainer = connect(mapState, mapDispatch)(Count)

ReactDOM.render(
  <Provider store={store}>
    <CountContainer />
  </Provider>,
  document.getElementById('root')
)
```

## Examples

- Count: [JS](https://codepen.io/Sh_McK/pen/BJMmXx?editors=1010) | [React](https://codesandbox.io/s/3kpyz2nnz6) | [Vue](https://codesandbox.io/s/n3373olqo0) | [Angular](https://stackblitz.com/edit/rematch-angular-5-count)
- Todos: [React](https://codesandbox.io/s/92mk9n6vww)

## Migrating From Redux

Moving from Redux to Rematch involves very few steps.

1. Setup Rematch `init` with Redux [step 1](https://codesandbox.io/s/yw2wy1q929)
2. Mix reducers & models [step 2](https://codesandbox.io/s/9yk6rjok1r)
3. Shift to models [step 3](https://codesandbox.io/s/mym2x8m7v9)

## Migration from 0.x to 1.x

For an earlier version, see [v0.x docs](https://github.com/rematch/rematch/tree/v0). Currently only displaying v1.x documentation.

Breaking changes with v1.0.0. Global imports of `dispatch` and `getState` have been removed. Instead, you can export and import your store, capturing `store.dispatch`, `store.getState`. See the [Changelog](./CHANGELOG.md) for details.


## API

See the [@rematch/core API](./docs/api.md)

## Changelog

See the [CHANGELOG](./CHANGELOG.md) to see what's new.

---

Like this project? ★ us on GitHub :)
