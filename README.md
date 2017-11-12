# Rematch

<p class='badges'>
  <a href='https://travis-ci.org/rematch/rematch' style='margin: 0 0.5rem;'>
    <img src='https://travis-ci.org/rematch/rematch.svg?branch=master' alt='Build Status'/>
  </a>

  <a href='https://coveralls.io/github/rematch/rematch?branch=master&service=github' style='margin: 0 0.5rem;'>
    <img src='https://coveralls.io/repos/github/rematch/rematch/badge.svg?branch=master&service=github' alt='Coverage Status' />
  </a>
</p>

> Rethink Redux. 

## Purpose

Rematch is Redux best practices without the boilerplate. 

A comparison may help:

#### Rematch

##### model
```js
import { init } from '@rematch/core'

const count = {
  name: 'count',
  state: 0,
  reducers: {
    upBy: (state, payload) => state + payload
  }
}

init({
  models: { count }
})

```

##### view
```js
import { dispatch } from '@rematch/core'
import { connect } from 'react-redux'

// Component

const mapToProps = (state) => ({
  count: state.count,
  countUpBy: dispatch.count.upBy,
})

connect(mapToProps)(Component)
```

#### Redux Best Practices

##### Action Type
```js
export const COUNT_UP_BY = 'COUNT_UP_BY'
```

##### Action Creator
```js
import { COUNT_UP_BY } from '../types/counter'

export const countUpBy = (value) => ({
  type: COUNT_UP_BY,
  payload: value,
})
```

##### Reducer
```js
import { COUNT_UP_BY } from '../types/counter'

const initialState = 0

export default (state = initialState, action) => {
  switch (action.type) {
    case COUNT_UP_BY:
      return state + action.payload
    default: return state
  }
}
```

##### Store
```js
import { createStore, combineReducers } from 'redux'
// devtools, reducers, middleware, etc.
export default createStore(reducers, initialState, enhancers)
```

##### View
```js
import { countUpBy } from '../actions/count'
import { connect } from 'react-redux'

// Component

const mapStateToProps = (state) => ({
  count: state.count,
})

const mapDispatchToProps = dispatch => ({
  countUpBy(payload) {
    dispatch(countUpBy(payload))
  },
})

connect(mapStateToProps, mapDispatchToProps)(Component)
```

#### Scoreboard

|   | Redux  | Rematch  |
|---|---|---|
| simple setup ‎ |   |  ‎✔	 |
| less boilerplate |   | ‎✔	 |
| readability  |   | ‎✔	|
| configurable | ‎✔  |  ‎✔	 |
| redux devtools  | ‎✔  |  ‎✔	 |
| generated action creators | ‎  |  ‎✔	 |
| global dispatch | ‎  |  ‎✔	 |
| selectors | ‎  |  ‎✔	 |
| action listeners | custom ‎middleware  |  ‎✔	 |
| async | thunks | ‎async/await  |


> Rematch?

## Example

### Level 1

```js
import { init, dispatch } from '@rematch/core'

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

dispatch.count.addOne() // { count: 1 }
dispatch.count.addBy(5) // { count: 6 }
dispatch({ type: 'count/addOne' }) // { count: 7 }
dispatch({ type: 'count/addBy', payload: 5 }) // { count: 12 }
```

### Level 2

```js
import { init, model, getStore } from '@rematch/core'

const todos = {
  name: 'todos',
  state: {
    todos: {
      1: {
        text: 'drink coffee',
        completed: false
      }
    }
  },
  reducers: {
    addTodo: (state, payload) => {
      state.todos[payload.id] = {
        text: payload.text,
        completed: false,
      }
      return state
    }
  },
  effects: {
    async loadTodos() {
      const todos = await fetch('https://example.com/todos')
      todos.forEach(todo => actions.todos.addTodo(todo))
    }
  },
  subscriptions: {
    'auth/login': () => actions.todos.loadTodos()
  },
  selectors: {
    getCompletedIds: state => {
      return Object.keys(state).filter(id => state.todos[id].completed)
    }
  },
}

init({
  models: { todos }
})

const state = getStore().getState()
select.todos.getCompletedIds(state) // [1, 2, 5]
```

## Installation

```js
npm install @rematch/core
```

## API

See the [full API](./docs/api.md).

## Plugins

- [loading](./plugins/loading)
- [persist](./plugins/persist)

## Inspiration

Refining the ideas of [Dva](github.com/dvajs/dva) & [Mirror](https://github.com/mirrorjs/mirror). Read more about what makes rematch different [here](./docs/inspiration.md).