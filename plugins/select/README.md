# Rematch Select

Selectors plugin for Rematch.

### Install

```
npm install @rematch/select
```

> For @rematch/core@0.x use @rematch/select@0.3.0

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

> note: By default, the selector state does not refer to the complete state, only the state within the model.
To change this behavior, use the sliceState configuration option described below.

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
      state => state,
      state => state.reduce((a, b) => a + (b.price * b.amount), 0)
    )
  }
}
```

### Configuration Options

The `selectorPlugin()` method will accept a configuration object with the following property.

#### sliceState:

`sliceState: (rootState, model) => any`

An option that allows the user to specify how the state will be sliced before being passed to the selectors.
The function takes the `rootState` as the first parameter and the `model` corresponding to the selector as the
second parameter.  It should return the desired state slice required by the selector.

The default is to return the slice of the state that corresponds to the owning model's name,
but this assumes the store is a Javascript object. Most of the time the default should be used.
However, there are some cases where one may want to specify the `sliceState` function.

##### Example 1 - Use the root state in selectors as opposed to a slice:

This can easily be accomplished by returning the `rootState` in the `getState` config:

```js
const select = selectorsPlugin({ sliceState: rootState => rootState });
```

Now the `state` parameter that is passed to all of the selectors will be the root state.

##### Example 2 - Use an Immutable JS object as the store

If you are using an [Immutable.js](https://facebook.github.io/immutable-js/) Map as your store, you will need to slice
the state using [Map.get()](http://facebook.github.io/immutable-js/docs/#/Map/get):

```js
const select = selectorsPlugin({ sliceState: (rootState, model) => rootState.get(model.name) })
```

Now you can use an [Immutable.js Map](http://facebook.github.io/immutable-js/docs/#/Map) as your store and access the
appropriate slice of the state in each of your selectors.
