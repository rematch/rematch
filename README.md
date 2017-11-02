# Rematch

[![Build Status](https://travis-ci.org/rematch/rematch.svg?branch=master)](https://travis-ci.org/rematch/rematch)

Rethink Redux.

### Purpose

Rematch makes Redux both easier to work with and more scalable. Helpful for both small and large applications. View agnostic - works with React, Vue, etc.

### Built In

- Redux store
- Redux devtools
- global dispatch
- simple async pattern
- selectors pattern
- action listener pattern

### Example

##### Level 1

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

##### Level 2

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
  selectors: {
    getCompletedIds: state => {
      return Object.keys(state).filter(id => state.todos[id].completed)
    }
  },
  subscriptions: {
    'auth/login': () => actions.todos.loadTodos()
  }
})

const state = getStore().getState()
select.todos.getCompletedIds(state) // [1, 2, 5]
```

### Installation

```js
npm install @rematch/core
```

### API

WIP - coming soon

### Plugins

- [loading](./plugins/loading)
- [persist](./plugins/persist)