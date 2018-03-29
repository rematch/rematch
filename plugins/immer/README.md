# Rematch Immer

Immer plugin for Rematch. Provides immutable ability on immer library.

### Install

```
npm install @rematch/immer
```

### Setup

```js
import selectorsPlugin from '@rematch/immer'
import { init } from '@rematch/core'

const immer = immerPlugin()

init({
  plugins: [immer]
})
```

### Usage

Reducer could be use mutable method to achieve immutable state, but this plugin may be some different that reducers must return value because literal don't support immer.

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