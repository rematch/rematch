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

1. What does it's initial state look like? **state**
2. In which ways do I change the state? **reducers**

In Rematch, we refer to the top level keys of that state tree as **models**.

### Step 1. Write your models

#### models.js
```js
import Rematch from '@rematch/core'

export const count = {
  state: 0, // the initial state
  reducers: { // describe state changes with pure functions
    incrementBy: (state, payload) => state + payload,    
  },
  effects: { // describe state changes the with impure functions
    async incrementByAsync(payload, state) {
      await Promise.resolve()
      Rematch.dispatch.count.incrementBy(payload)
    }
  }
}
```

### Step 2. Start Rematch

#### index.js

```js
import Rematch from '@rematch/core'
import * as models from './models'

Rematch.init({ models })
```

### Step 3. Connect your view layer

**React** | [Vue](./docs/views/vue.md) | [Angular](./docs/views/vue.md)

```jsx
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider, connect } from 'react-redux'
import Rematch from '@rematch/core'

const Count = props => (
  <div>
    <h1>The count is: {props.count}</h1>
    <button onClick={props.incrementByOne}>Increment 1</button>
    <button onClick={props.incrementByOneAsync}>Increment 1 Async</button>
  </div>
)

const CountContainer = connect(state => ({
  count: state.count,
  incrementByOne: () => Rematch.dispatch.count.incrementBy(1),
  incrementByOneAsync: () => Rematch.dispatch.count.incrementByAsync(1)
}))(Count)

ReactDOM.render(
  <Provider store={getStore()}>
    <CountContainer />
  </Provider>,
  document.getElementById('root')
)
```
