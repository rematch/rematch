# Rematch

<p style='display:flex;'>
  <a style='margin: 0 0.5rem;' href='https://travis-ci.org/rematch/rematch'>
    <img src='https://travis-ci.org/rematch/rematch.svg?branch=master' alt='Build Status'/>
  </a>

  <a style='margin: 0 0.5rem;' href='https://coveralls.io/github/rematch/rematch?branch=master'>
    <img src='https://coveralls.io/repos/github/rematch/rematch/badge.svg?branch=master' alt='Coverage Status' />
  </a>
</p>

Rethink Redux.

## Purpose

Rematch makes Redux both easier to work with and more scalable. Helpful for both small and large applications. View agnostic - works with React, Vue, etc.

## Built In

- Redux store
- Redux devtools
- global dispatch
- simple async pattern
- selectors pattern
- action listener pattern

## Example

### Level 1

```js
import { init, model, dispatch } from '@rematch/core'

init()

model({
  name: 'count',
  state: 0,
  reducers: {
    addOne: (state) => state + 1,
    addBy: (state, payload) => state + payload
  }
})

dispatch.count.addOne() // { count: 1 }
dispatch.count.addBy(5) // { count: 6 }
```

### Level 2

```js
import { init, model, getStore } from '@rematch/core'

init()

model({
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
    async loadTodos(payload) {
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
})

const state = getStore().getState()
select.todos.getCompletedIds(state) // [1, 2, 5]
```

## Installation

```js
npm install @rematch/core
```

## API

- init
- model
  - name
  - state
  - reducers
  - effects
  - subscriptions
  - selectors
- dispatch
- getStore

## Plugins

- [loading](./plugins/loading)
- [persist](./plugins/persist)

## Inspiration

Refining the ideas of [Dva](github.com/dvajs/dva) & [Mirror](https://github.com/mirrorjs/mirror). We think we've made a few significant improvements:

##### State only, no View or Router Opinion

Rematch is not bound to any specific router, view library or framework. It can be used with React, Vue, etc., or any combination of view libraries.

##### Easier to Migrate Codebase

Migrating from Redux to Rematch may only involve minor changes to your state management, and no necessary changes to your view logic. You can continue to use your current reducers, passed in to `init` as `extraReducers`. You can also use `dispatch(action)` directly to trigger actions.

##### Composable Plugins

Rematch and its internals are all built upon a plugin pipeline. Everything from dispatch to selectors is a plugin. As a result, developers can make complex custom plugins that modify the setup or add to the `model`, often without requiring any changes to Rematch itself.
