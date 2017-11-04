<style>
  .badges > * {
    margin: 0 0.5rem;
  }
</style>

# Rematch

<p class='badges'>
  <a href='https://travis-ci.org/rematch/rematch'>
    <img src='https://travis-ci.org/rematch/rematch.svg?branch=master' alt='Build Status'/>
  </a>

  <a href='https://coveralls.io/github/rematch/rematch?branch=master'>
    <img src='https://coveralls.io/repos/github/rematch/rematch/badge.svg?branch=master' alt='Coverage Status' />
  </a>
</p>

> Rethink Redux. 

Rematch is Redux best practices without the boilerplate. 

<table width='100%' margin=0>
<thead>
  <tr>
    <th>Redux Best Practices</th>
    <th>Rematch</th>
  </tr>    
</thead>
<tbody>
  <tr>
    <td>
    <h3>Action Types</h3>
    <div class='highlight highlight-source-js'>
      <pre><code>export const COUNT_UP_BY = 'COUNT_UP_BY'</code></pre>
    </div>
    <h3>Action Creators</h3>
    <div class='highlight highlight-source-js'>
      <pre><code>import { COUNT_UP_BY } from '../types/counter'

export const countUpBy = (value) => ({
  type: COUNT_UP_BY,
  payload: value,
})</code></pre>
    </div>
    <h3>Reducers</h3>
    <div class='highlight highlight-source-js'>
      <pre><code>import { COUNT_UP_BY } from '../types/counter'

const initialState = 0

export default (state = initialState, action) => {
  switch (action.type) {
    case COUNT_UP_BY:
      return state + action.payload
    default: return state
  }
}</code></pre>
    </div>
  </td>
  <td class='highlight highlight-source-js'>
    <h3>Model</h3>
    <pre><code>import { model } from '@rematch/core'

model({
  name: 'count',
  state: 0,
  reducers: {
    upBy: (state, payload) => state + payload
  }
})</code></pre>
    </td>
  </tr>
  <tr>
  <td valign='top'>
    <h3>Connect</h3>
 <div class='highlight highlight-source-js'>
      <pre><code>import { countUpBy } from '../actions/count'

const mapStateToProps = (state) => ({
  count: state.count,
})

const mapDispatchToProps = dispatch => ({
  countUpBy(payload) {
    dispatch(countUpBy(payload))
  },
})

connect(mapStateToProps, mapDispatchToProps)(Component)</code></pre>
    </div>
  </td>
  <td valign='top'>
  <h3>Connect</h3>
 <div class='highlight highlight-source-js'>
      <pre><code>import { dispatch } from '@rematch/core'

const mapToProps = (state) => ({
  count: state.count,
  countUpBy: dispatch.count.upBy,
})

connect(mapToProps)(Component)</code></pre>
    </div>
  </td>
  </tr>
</tbody>
</table>

## Built In

- Redux store
- Redux devtools
- global dispatch
- FSA action creators
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
dispatch({ type: 'count/addOne' }) // { count: 7 }
dispatch({ type: 'count/addBy', payload: 5 }) // { count: 12 }
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
