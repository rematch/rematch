# Rematch Immer

Immer plugin for Rematch. Provides immutable ability on immer library.

### Install

```
npm install @rematch/immer
```

> For @rematch/core@0.x use @rematch/immer@0.1.0

### Setup

```js
import immerPlugin from '@rematch/immer'
import { init } from '@rematch/core'

const immer = immerPlugin()

init({
  plugins: [immer]
})
```

### Usage

Use Immer plugin, reducer could be use mutable method to achieve immutable state. Like the example:

```js
const todo = {
  state: [{
    todo: "Learn typescript",
    done: true
  }, {
    todo: "Try immer",
    done: false
  }],
  reducers: {
    done(state) {
      state.push({todo: "Tweet about it"})
      state[1].done = true
      return state
    }
  }
};
```

In Immer, reducers perform mutations to achieve the next immutable state. Keep in mind, Immer only supports change detection on plain objects and arrays, so primitive values like strings or numbers will always return a change. Like the example:

```js
const count = {
  state: 0,
  reducers: {
    add(state) {
      state += 1
      return state
    }
  }
};
```

I suggest to developers that reducers could return changed value all the time.
