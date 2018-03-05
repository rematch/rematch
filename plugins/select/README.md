# Rematch Select

Selectors plugin for Rematch.

### Install

```
npm install @rematch/select
```

### Setup

```js
import selectorsPlugin from '@rematch/select'
import { init } from '@rematch/core'

const select = selectorsPlugin()

init({
  plugins: [select]
})
```

### selectors

`selectors: { [string]: (state, ...params) => any }`

Selectors are read-only snippets of state.

```js
{
  name: 'cart',
  state: [{
    price: 42.00,
    amount: 3,
  }],
  selectors: {
    total(state) {
      return state.reduce((a, b) => a + (b.price * b.amount), 0)
    }
  }
}
```

> note: selector state does not refer to the complete state, only the state within the model

Selectors can be called anywhere within your app.

```js
import { select } from '@rematch/select'

const store = init({ ... })

select.cart.total(store.getState())
```

Selectors can also be used with memoization libraries like [reselect](https://github.com/reactjs/reselect).

```js
import { createSelector } from 'reselect'

{
  selectors: {
    total: createSelector(
      state => state.reduce((a, b) => a + (b.price * b.amount), 0)
    )
  }
}
```
