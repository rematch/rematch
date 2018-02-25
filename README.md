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

Rematch is Redux best practices without the boilerplate. No more action types, action creators, switch statements or thunks. [See a comparison](./docs/purpose.md).

## Installation

```sh
npm install @rematch/core
```

## Getting Started

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

- Count: [JS](https://codepen.io/Sh_McK/pen/BJMmXx?editors=1010) | [React](https://codesandbox.io/s/3kpyz2nnz6) | [Vue](https://codesandbox.io/s/6j1vvnl20k) | [Angular](https://stackblitz.com/edit/rematch-angular-5-count)
- Todos: [React](https://codesandbox.io/s/92mk9n6vww)

## Complete Example

JS | **React** | Vue | Angular

```jsx
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider, connect } from 'react-redux'
import { init } from '@rematch/core'

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
    <button onClick={props.increment}>increment</button>
    <button onClick={props.incrementAsync}>incrementAsync</button>
  </div>
)

const mapState = state => ({
  count: state.count
})

const mapDispatch = dispatch => ({
  increment: () => dispatch.count.increment(1),
  incrementAsync: () => dispatch.count.incrementAsync(1)
})

const CountContainer = connect(mapState, mapDispatch)(Count)

ReactDOM.render(
  <Provider store={store}>
    <CountContainer />
  </Provider>,
  document.getElementById('root')
)
```


## API

See the [API Reference](./docs/api.md).

---

Like this project? ★ us on Github :)
