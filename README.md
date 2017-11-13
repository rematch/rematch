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

> Rethink Redux. 

## Purpose

Rematch is Redux best practices without the boilerplate. [Read more](./docs/purpose.md).

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

See the [API Reference](./docs/api.md).

## Plugins

- [loading](./plugins/loading)
- [persist](./plugins/persist)

## Inspiration

Refining the ideas of [Dva](github.com/dvajs/dva) & [Mirror](https://github.com/mirrorjs/mirror). Read more about what makes rematch different [here](./docs/inspiration.md).