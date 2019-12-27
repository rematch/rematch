![](./docs/_media/icon.svg)


# Getting Started

[![Chat on slack](https://img.shields.io/badge/slack-rematchjs-blue.svg?logo=slack&style=flat)](https://rematchjs.slack.com)[![Build Status](https://travis-ci.org/rematch/rematch.svg?branch=master)](https://travis-ci.org/rematch/rematch)[![Coverage Status](https://coveralls.io/repos/github/rematch/rematch/badge.svg?branch=master)](https://coveralls.io/github/rematch/rematch?branch=master)[![Npm version](https://img.shields.io/npm/v/@rematch/core?color=bright-green&style=flat)](https://badge.fury.io/js/%40rematch%2Fcore)[![Bundle size](https://img.shields.io/badge/bundlesize-~5kb-brightgreen.svg?style=flat)](https://img.shields.io/badge/bundlesize-~5kb-brightgreen.svg?style=flat)[![File size](https://img.shields.io/badge/dependencies-redux-brightgreen.svg?style=flat)](https://img.shields.io/badge/dependencies-redux-brightgreen.svg?style=flat)

## Rematch

### Rethink Redux.

Rematch is Redux best practices without the boilerplate. No more action types, action creators, switch statements or thunks.

- [Why we created Rematch](https://hackernoon.com/redesigning-redux-b2baee8b8a38)
- [Video: Introducing Rematch](https://www.youtube.com/watch?v=3ezSBYoL5do)
- [A comparison of Redux & Rematch](https://rematch.github.io/rematch/#/purpose.md)

### Index

- [Getting Started](https://rematch.github.io/rematch/#/README?id=getting-started-1)
- [Purpose](https://rematch.github.io/rematch/#/purpose.md)
- [Examples](https://rematch.github.io/rematch/#/examples)
- [Migration Guide](https://rematch.github.io/rematch/#/migration-guide)
- API Reference
  - [Core API](https://rematch.github.io/rematch/#/api-reference/api.md)
  - [Init Redux API](https://rematch.github.io/rematch/#/api-reference/reduxapi.md)
  - [Plugins API](https://rematch.github.io/rematch/#/api-reference/pluginsapi.md)
- Recipes
  - [Devtools](https://rematch.github.io/rematch/#/recipes/devtools.md)
  - [React](https://rematch.github.io/rematch/#/recipes/react.md)
  - [Vue](https://rematch.github.io/rematch/#/recipes/vue.md)
  - [Testing](https://rematch.github.io/rematch/#/recipes/testing.md)
  - [TypeScript](https://rematch.github.io/rematch/#/recipes/typescript.md)
  - [Immer](https://rematch.github.io/rematch/#/recipes/immer.md)
  - [Decoupling reducers](https://rematch.github.io/rematch/#/recipes/decouplingreducers.md)
- Plugins
  - [Selectors](https://rematch.github.io/rematch/#/plugins/select.md)
  - [Loading](https://rematch.github.io/rematch/#/plugins/loading.md)
  - [Persist](https://rematch.github.io/rematch/#/plugins/persist.md)
  - [Updated](https://rematch.github.io/rematch/#/plugins/updated.md)
  - [React Navigation](https://rematch.github.io/rematch/#/plugins/react-navigation.md)
  - [Immer](https://rematch.github.io/rematch/#/plugins/immer.md)
- [Inspiration](https://rematch.github.io/rematch/#/inspiration.md)

**Translations**

- [中文手册](https://rematch.github.io/rematch/#/lang/zh-cn/)

### Getting Started

```bash
npm install @rematch/core
```
or
```bash
yarn add @rematch/core
```


#### Step 1: Init

**init** configures your reducers, devtools & store.

**index.js**

```javascript
import { init } from '@rematch/core'
import * as models from './models'

const store = init({
	models,
})

export default store
```

_For a more advanced setup, see_ [_plugins_](https://github.com/rematch/rematch/tree/e4fe17537a947bbe8a9faf1e0e77099beb7fef91/docs/plugins.md) _and_ [_Redux config options_](docs/api-reference/reduxapi.md)_._

#### Step 2: Models

The **model** brings together state, reducers, async actions & action creators in one place.

**models.js**

```javascript
export const count = {
	state: 0, // initial state
	reducers: {
		// handle state changes with pure functions
		increment(state, payload) {
			return state + payload
		},
	},
	effects: dispatch => ({
		// handle state changes with impure functions.
		// use async/await for async actions
		async incrementAsync(payload, rootState) {
			await new Promise(resolve => setTimeout(resolve, 1000))
			dispatch.count.increment(payload)
		},
	}),
}
```

_See the_ [_reducers docs_](https://github.com/rematch/rematch/blob/master/docs/api.md#reducers) _to learn more, including how to trigger actions from other models._

Understanding models is as simple as answering a few questions:

1. What is my initial state? **state**
2. How do I change the state? **reducers**
3. How do I handle async actions? **effects** with async/await

#### Step 3: Dispatch

**dispatch** is how we trigger reducers & effects in your models. Dispatch standardizes your actions without the need for writing action types or action creators.

```javascript
import { init } from '@rematch/core'
import * as models from './models'

const store = init({
	models,
})

export const { dispatch } = store
// state = { count: 0 }
// reducers
dispatch({ type: 'count/increment', payload: 1 }) // state = { count: 1 }
dispatch.count.increment(1) // state = { count: 2 }

// effects
dispatch({ type: 'count/incrementAsync', payload: 1 }) // state = { count: 3 } after delay
dispatch.count.incrementAsync(1) // state = { count: 4 } after delay
```

Dispatch can be called directly, or with the `dispatch[model][action](payload)` shorthand.

#### Step 4: View

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
	count: state.count,
})

const mapDispatch = ({ count: { increment, incrementAsync } }) => ({
	increment: () => increment(1),
	incrementAsync: () => incrementAsync(1),
})

const CountContainer = connect(
	mapState,
	mapDispatch
)(Count)

ReactDOM.render(
	<Provider store={store}>
		<CountContainer />
	</Provider>,
	document.getElementById('root')
)
```

### Examples

- Count: [JS](https://codepen.io/Sh_McK/pen/BJMmXx?editors=1010) \| [React](https://codesandbox.io/s/3kpyz2nnz6) \| [Vue](https://codesandbox.io/s/n3373olqo0) \| [Angular](https://stackblitz.com/edit/rematch-angular-5-count)
- Todos: [React](https://codesandbox.io/s/92mk9n6vww)

### Migrating From Redux

Moving from Redux to Rematch involves very few steps.

1. Setup Rematch `init` with Redux [step 1](https://codesandbox.io/s/yw2wy1q929)
2. Mix reducers & models [step 2](https://codesandbox.io/s/9yk6rjok1r)
3. Shift to models [step 3](https://codesandbox.io/s/mym2x8m7v9)

### Migration from 0.x to 1.x

For an earlier version, see [v0.x docs](https://github.com/rematch/rematch/tree/v0). Currently only displaying v1.x documentation.

Breaking changes with v1.0.0. Global imports of `dispatch` and `getState` have been removed. Instead, you can export and import your store, capturing `store.dispatch`, `store.getState`. See the [Changelog](https://github.com/rematch/rematch/blob/master/CHANGELOG.md) for details.

### API

See the [@rematch/core API](https://rematch.github.io/rematch/#/api-reference/api.md)

### Changelog

See the [CHANGELOG](https://github.com/rematch/rematch/blob/master/CHANGELOG.md) to see what's new.

Like this project? ★ us on GitHub :\)
