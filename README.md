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

Rematch is Redux best practices without the boilerplate. No more action types, action creators, switch statements or thunks. [See a comparison of the two](./docs/purpose.md)

## Installation

```js
npm install @rematch/core
```

## API

See the [API Reference](./docs/api.md).


## WalkThrough

### Step 1. Models

The **model** brings together state, reducers, async actions & action creators in one place. Understanding models is as simple as answering a few questions:

1. What is my initial state? **state**
2. How do I change the state? **reducers**
3. How do I handle asynchronous actions? **effects** with async/await

#### models.js
```js
import { dispatch } from '@rematch/core'

export const count = {
  state: 0, // the initial state
  reducers: { // describe state changes with pure functions
    incrementBy: (state, payload) => state + payload,    
  },
  effects: { // describe state changes the with impure functions
    async incrementByAsync(payload, state) {
      await Promise.resolve()
      dispatch.count.incrementBy(payload)
    }
  }
}
```

### Step 2. Init

**init** configures your reducers, devtools & store. For additional setup, pass in a configuration or one of many existing [plugins](./docs/plugins.md).

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

### Step 3. View

**dispatch** is a helpful shorthand for triggering reducers & effects in your models.
Dispatch standardizes your actions without the need for action types, action creators, or mapDispatchToProps.

In Rematch, `dispatch.count.addOne(1)` is the same as `dispatch({ type: 'count/addOne', payload: 1 })`.

**React** | Vue | AngularJS | Angular 2

```jsx
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider, connect } from 'react-redux'
import { dispatch, getStore } from '@rematch/core'

const Count = props => (
  <div>
    <h1>The count is: {props.count}</h1>
    <button onClick={props.incrementByOne}>Increment 1</button>
    <button onClick={props.incrementByOneAsync}>Increment 1 Async</button>
  </div>
)

const CountContainer = connect(state => ({
  count: state.count,
  incrementByOne: () => dispatch.count.incrementBy(1),
  incrementByOneAsync: () => dispatch.count.incrementByAsync(1)
}))(Count)

ReactDOM.render(
  <Provider store={getStore()}>
    <CountContainer />
  </Provider>,
  document.getElementById('root')
)
```
