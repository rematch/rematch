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

```js
import { init, model } from '@rematch/core'

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
    async loadTodos(payload, state) {
      const todos = await fetch('https://example.com/todos')
      todos.forEach(todo => addTodo({ id: 2, text: todo.text }))
    }
  },
  selectors: {
    getCompletedIds: state => {
      return Object.keys(state).filter(id => state.todos[id].completed)
    }
  }
})
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