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

Inspired by the React/Redux frameworks [dva](github.com/dvajs/dva) & [mirror](https://github.com/mirrorjs/mirror).
