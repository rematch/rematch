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

## Rethink Redux.

Rematch is Redux best practices without the boilerplate. No more action types, action creators, switch statements or thunks. [See a comparison](./docs/purpose.md).

## Installation

```js
npm install @rematch/core
```

## Getting Started

### Step 1: Models

The **model** brings together state, reducers, async actions & action creators in one place.

#### models.js
```js
import { dispatch } from '@rematch/core'

export const count = {
  state: 0, // initial state
  reducers: { // state changes with pure functions
    addBy: (state, payload) => state + payload,    
  },
  effects: { // state changes with impure functions
    async addByAsync(payload, state) {
      await Promise.resolve()
      dispatch.count.addBy(payload)
    }
  }
}
```

Understanding models is as simple as answering a few questions:

1. What is my initial state? **state**
2. How do I change the state? **reducers**
3. How do I handle asynchronous actions? **effects** with async/await

### Step 2: Init

**init** configures your reducers, devtools & store. 

#### index.js

```js
import { init } from '@rematch/core'
import * as models from './models'
import plugins from './plugins'

init({
  models,
  plugins,
})
```

For additional setup, pass in a configuration or one of many existing [plugins](./docs/plugins.md).

### Step 3: View

**dispatch** is a helpful shorthand for triggering reducers & effects in your models.
Dispatch standardizes your actions without the need for action types, action creators, or mapDispatchToProps. `dispatch.count.incrementBy(1)` is the same as `dispatch({ type: 'count/incrementBy', payload: 1 })`.

**React** | Vue | AngularJS | Angular 2

```jsx
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider, connect } from 'react-redux'
import { dispatch, getStore } from '@rematch/core'

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

const store = getStore()

ReactDOM.render(
  <Provider store={store}>
    <CountContainer />
  </Provider>,
  document.getElementById('root')
)
```

## API

See the [API Reference](./docs/api.md).
