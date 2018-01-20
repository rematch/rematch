# Rematch

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

## Rethink Redux.

Rematch is Redux best practices without the boilerplate. No more action types, action creators, switch statements or thunks. [See a comparison](./docs/purpose.md).

## Installation

```js
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
  plugins: [],
})
```

For additional setup, pass in a configuration or one of many existing [plugins](./docs/plugins.md).

### Step 2: Models

The **model** brings together state, reducers, async actions & action creators in one place.

#### models.js
```js
export const count = {
  state: 0, // initial state
  reducers: { // state changes with pure functions
    addBy: (state, payload) => state + payload,    
  },
  effects: { // state changes with impure functions
    async addByAsync(payload, state) {
      await Promise.resolve()
      this.addBy(payload)
    }
  }
}
```

Understanding models is as simple as answering a few questions:

1. What is my initial state? **state**
2. How do I change the state? **reducers**
3. How do I handle asynchronous actions? **effects** with async/await

### Step 3: Dispatch

**dispatch** is how we trigger reducers & effects in your models. Dispatch standardizes your actions without the need for action types, action creators, or mapDispatchToProps.

```js
import { dispatch } from '@rematch/core'
                                              // state = { count: 0 }
// reducers
dispatch({ type: 'count/addBy', payload: 1 }) // state = { count: 1 }
dispatch.count.addBy(1)                       // state = { count: 2 }

// effects
dispatch({ type: 'count/addByAsync', payload: 1 }) // state = { count: 3 } after delay
dispatch.count.addByAsync(1)                  // state = { count: 4 } after delay
```

Dispatch can be called directly, or with the `dispatch.model.action(payload)` shorthand.


## Examples

- Count: [React](https://codesandbox.io/s/3kpyz2nnz6) | [Vue](https://codesandbox.io/s/6j1vvnl20k) | [Angular](https://stackblitz.com/edit/rematch-angular-5-count)
- Todos: [React](https://codesandbox.io/s/92mk9n6vww)

## Usage

**React** | Vue | Angular | AngularJS

```jsx
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider, connect } from 'react-redux'
import { init, dispatch } from '@rematch/core'
import * as models from './models'

const store = init({
  models,
})

const Count = props => (
  <div>
    <h1>The count is: {props.count}</h1>
    <button onClick={props.addByOne}>Add 1</button>
    <button onClick={props.addByOneAsync}>Add 1 Async</button>
  </div>
)

const CountContainer = connect(state => ({
  count: state.count,
  addByOne: () => dispatch.count.addBy(1),
  addByOneAsync: () => dispatch.count.addByAsync(1)
}))(Count)

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
