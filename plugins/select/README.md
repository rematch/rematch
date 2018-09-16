# Rematch Select

A plugin to add memoized state selection to Rematch - Wires your store models with dependencies and collects their selectors. Selectors are created using [reselect](https://github.com/reduxjs/reselect) by default.

> This is the documentation for @rematch/select 2.0. For older versions see [the legacy docs](https://github.com/rematch/rematch/blob/v1/plugins/select/README.md)

- [Getting Started](#getting-started)
- [Building Selectors](#building-selectors)
- [API Docs](#api-docs)
- [Recipes](#recipes)



## Getting Started

### Install

```
npm install @rematch/select
```



### Setup

```js
import selectPlugin from '@rematch/select'
import { init } from '@rematch/core'

init({
  plugins: [selectPlugin()]
})
```



## Building Selectors

### Basics

A "selector" is just a function that uses the current state to derive a value:
```ts
(state, payload?) => any
```

A connected component's `mapStateToProps` is already a selector!

```js
const mapStateToProps = (state, props) => ({
  total: state.cart.items.reduce((a, b) => a + (b.price * b.amount), 0),
})

connect(mapStateToProps)(MyComponent)
```



### Model Selectors

Your store models can declare commonly used selectors to be re-used throughout your application.

**Some models may need to use the selectors of other models; to make sure a selector is available, each one is created by a factory function.** During the `createStore()` call, each factory will be evaluated once.

You can create selectors for a model by adding a `selectors` config:

```js
const model = {
  ...
  selectors: { ... }
}
```

As we saw above, the most basic selector is a function that receives `rootState`:

```js
const model = {
  name: 'cart',
  state: [{
    price: 42.00,
    amount: 3,
  }],
  selectors: {
    total() {
      return (rootState, props) =>
        rootState.cart.reduce((a, b) => a + (b.price * b.amount), 0)
    }
  }
}
```



Now, we've made the previous `mapStateToProps` function easy to re-use, but it will still be recomputed any time our `rootState` changes. To make our app perform better, we can use [redux's reselect ](https://github.com/reduxjs/reselect) api in our model :

```js
const model = {
  ...
  selectors: (slice, createSelector, hasProps) => ({ ... })
}
```



The Cart's model doesn't use any other models to compute the total - when any other models do update, total will stay the same. We can keep our app from repeating work by caching the result of total. `slice` re-runs a function only when the current model has actually updated.


> Only the current model knows about itself implicitly.
> To make a part of the model's state public, add a named selector to expose it.


```js
total () {
  return slice(cart =>
    cart.reduce((a, b) => a + (b.price * b.amount), 0)
  )
}
```



As mentioned, some models might need to use other selectors to derive some values. The `createSelector` function uses every argument but the last to map `rootState` to values to watch before running the function passed as the final argument. By default, this is reselect's `createSelector`.

> If you don't pass a function to `slice`, calling it will just return the current model's slice of state.

```js
total () {
  return createSelector(
    slice,
    (state, props) => props.shipping,
    (cart, shipping) => cart.reduce((a, b) => a + (b.price * b.amount), shipping)
  )
}
```



### Combining selectors

`@rematch/select` uses factory functions to allow each model to depend on other models' state.

> It might be less redundant to give `select` the descriptive name `models` internally.

&nbsp;

> If your factory is declared using `function`, you can use `this` as a shortcut to the current model's selectors.

```js
poorSortByHot (models) {
  return createSelector(
    this.rankableItems,
    models.popularity.pastDay,
    (cart, hot) => cart.sort((a, b) => hot[a.product] > hot[b.product])
  )
}
```

#### Alternatives

Selectors are great for deriving state lazily. But, models can only depend on the selectors other model makes public - `slice` will only ever access the current model.

Using listeners to eagerly keep track of the changes to another model might fit some applications better:
```js
reducers: {
  'selectedGroup/change' (state, id) {
    return {
      ...state,
      list: id
        ? state.unfilteredList.filter.(p => p.group === id)
        : state.unfilteredList
    }
  }
}
```



### Selector arguments

You may have noticed that a selector's dependencies can receive `props`:
```js
(state, props) => props.shipping
```

[We need to be careful when passing `props` to a selector because of how reselect caches results. ](https://github.com/reduxjs/reselect/blob/master/README.md#sharing-selectors-with-props-across-multiple-component-instances)

If your selector uses `props`, the third function passed in your model config, `hasProps`, can create a new selector cache for each new set of `props`.

`hasProps` wraps an entire selector factory - it creates factories that can be used in other factories. [For complex calculations or dashboards a recipe may be better](#re-reselect)



```js
expensiveFilter: hasProps(function (models, lowerLimit) {
  return slice(items => items.filter(item => item.price > lowerLimit))
}),

wouldGetFreeShipping () {
  return this.expensiveFilter(20.00)
},
```



## Using Selectors in your app

`@rematch/select` adds a `select` property to the store. When called as a function, `select` will lazily call its argument - a function mapping the store's models to an object containing selectors - and return a new selector function. When passed to a function like `connect`, the resulting function runs each mapped selector and returns an object to merge with the existing props.


> Under the hood, `select` creates a [structuredSelector](https://github.com/reduxjs/reselect#createstructuredselectorinputselectors-selectorcreator--createselector).


```js
const selection = store.select(models => ({
  total: models.cart.total,
  eligibleItems: models.cart.wouldGetFreeShipping
}))

connect(selection)(MyComponent)
```



If you need to define one-off selectors with your components, you can call `selection` yourself:

```js
connect(state => ({
  contacts: state.contacts.collection,
  ...selection(state),
}))(MyComponent)
```



**Its important to note that selectors don't have to be used in `connect`.** Most selectors can be called anywhere within your app:

```js
store.select.cart.expensiveFilter(50.00)(store.getState())
```



## Other Selector Creators

`@rematch/select` supports using your own `selectorCreator` directly in the models.

> Configuring this store-wide in `options` makes testing easier.

```js
isHypeBeast (models) {
  return customCreateSelector(
    slice,
    state => this.sortByHot(state)[0],
    (state, hottest) => hottest.price > 100.00
  )
}
```



## API Docs

```js
import selectPlugin from '@rematch/select'
```

- [selectPlugin](#selectplugin)
  - [selectorCreator](#configselectorcreator)
  - [sliceState](#configslicestate)
- [store.select](#storeselect)



### selectPlugin

- `selectPlugin(config?: any)`

Create the plugin.

```js
init({
  plugins: [ selectPlugin(config) ]
})
```



#### config.selectorCreator:

- `selectorCreator: (...deps, resultFunc) => any`

An option that allows the user to specify a different function to be used when creating selectors.

The default is `createSelector` from `reselect`. See [recipes](#Recipes) for other uses.



#### config.sliceState:

- `sliceState: (rootState, model) => any`

An option that allows the user to specify how the state will be sliced in the `slice` function.
The function takes the `rootState` as the first parameter and the `model` corresponding to the selector as the
second parameter. It should return the desired state slice required by the selector.

The default is to return the slice of the state that corresponds to the owning model's name, but this assumes the store is a Javascript object.

Most of the time the default should be used, however, there are some cases where one may want to specify the `sliceState` function. See [the immutable.js recipe for an example.](#immutablejs)



### store.select:

- `select( mapSelectToStructure: (select) => object)`

When called as a function, `select` lazily creates a [structuredSelector](https://github.com/reduxjs/reselect#createstructuredselectorinputselectors-selectorcreator--createselector) using the selectors you return in `mapSelectToStructure`.


- `select: { [modelName]: { [selectorName]: (state) => any } }`

`select` is also an object with a group of selectors for each of your store models. Selectors are regular functions that can be called anywhere within your application.



## Recipes

### Re-reselect
When working on a dashboard or doing calculations with a lot of external values, you may find your selectors always re-run. This happens when your selector has props (such as a `hasProps` factory) and then share your selectors between multiple components.

Selectors have a cache size of 1. Passing a different set of props will invalidate the cache. [re-reselect exists to solve this by caching your selectors by props as well](https://github.com/toomuchdesign/re-reselect)

```js
import { createCachedSelector } from 're-reselect'

selectorPlugin({
  selectorCreator: createCachedSelector
})
```

```js
total () {
  const mapProps = (state, props) => props.id
  return createSelector(
    slice,
    mapProps,
    (cart, id) => cart.reduce((a, b) => a + (b.price * b.amount), 0)
  )(mapProps)
}
```

### Immutable.js

**Use an Immutable JS object as the store**
If you are using an [Immutable.js](https://facebook.github.io/immutable-js/) Map as your store, you will need to slice
the state using [Map.get()](http://facebook.github.io/immutable-js/docs/#/Map/get):

```js
selectorsPlugin({
  sliceState: (rootState, model) =>
    rootState.get(model.name)
})
```

Now you can use an [Immutable.js Map](http://facebook.github.io/immutable-js/docs/#/Map) as your store and access the
appropriate slice of the state in each of your selectors.
