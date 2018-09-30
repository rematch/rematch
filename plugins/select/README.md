# Rematch Select

Selectors plugin for Rematch. Wires your store models with dependencies and collects their selectors. Uses [reselect](https://github.com/reduxjs/reselect) by default.

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

Selectors are read-only snippets of state. They can be combined across models for powerful data retrieval.

**Since selectors can depend on each other, they need to be created by factory functions.** When the store is fully ready, each factory will be evaluated once.

> { selectors: { (models) => selector  } }

The most basic selector is a function that receives `rootState`:

```js
{
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



If we hook total up to something like `react-redux`'s `connect`, it will be recomputed any time our `rootState` changes. To avoid this, `@rematch/select` includes `reselect`.

Models gain access to the `reselect` api through dependency injection:

```js
{
  name: 'cart',
  selectors: (slice, createSelector, hasProps) => ({
    ...
  })
}
```



Our selector, `total`, depends only on the cart model's state and doesn't need to update when the rest of the store updates. `slice` creates a basic selector
memoized by the model's slice of state.


> `slice` is private to the current model.  
> To make a part of your model's state public, add a selector


```js
total () {
  return slice(cart =>
    cart.reduce((a, b) => a + (b.price * b.amount), 0)
  )
}
```



If you want more control over what the dependencies of your selector are,
you can directly call the passed in `createSelector`.
This will memoize the last function by the results of all the previous functions.

> `slice` can also be used as a selector directly, simply returning the model's slice of state.

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

`@rematch/select` injects `select` into each selector factory to allow it to depend on other models state.

> It might be less redundant to give `select` the descriptive name `models` internally.

> If your factory is a `function`, you can use `this` as a shortcut to the current model's selectors.

```js
poorSortByHot (models) {
  return createSelector(
    this.cart,
    models.popularity.pastDay,
    (cart, hot) => cart.sort((a, b) => hot[a.product] > hot[b.product])
  )
}
```

#### Deriving state

Selectors are great for deriving state lazily. But, you should only depend on the selectors a model makes public - access to another model's `slice` is not allowed.

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

As you may have noticed, a selector's dependencies can receive `props`:
```js
(state, props) => props.shipping
```

[Be careful when passing `props` to a selector - passing different props could reset the cache! ](https://github.com/reduxjs/reselect/blob/master/README.md#sharing-selectors-with-props-across-multiple-component-instances)

In some situations, configurable selectors may be better off with isolated caches. To opt-in to this behavior and create a new cache for every configuration, `@rematch/select` injects `hasProps`.

`hasProps` wraps a factory so that it receives `models` and `props`. [For complex calculations or dashboards a recipe may be better](#re-reselect)


> `hasProps` is a "higher-order selector factory" - it creates factories that can be used in other factories


```js
expensiveFilter: hasProps(function (models, lowerLimit) {
  return slice(items => items.filter(item => item.price > lowerLimit))
}),

wouldGetFreeShipping () {
  return this.expensiveFilter(20.00)
},
```



## Using Selectors in your app

Most apps will consume selectors through `connect`. For this use case, the store's `select` can be called as a function to create a selector you can pass directly to connect, or call yourself. As a function, `select` ensures your component re-renders only when its data actually changes.

> Under the hood, `select` creates a [structuredSelector](https://github.com/reduxjs/reselect#createstructuredselectorinputselectors-selectorcreator--createselector).

```js
import { connect } from 'react-redux'
import { select } = './store'

connect(select(models => {
  total: models.cart.total,
  eligibleItems: models.cart.wouldGetFreeShipping
}))(...)
```

Here is a full example combining raw, uncomputed state with selected state:

```js
const mapStateToProps = state => {
  const selection = select(models => ({
    devices: models.devices.selected,
  }))

  return {
    contacts: state.contacts.collection,
    ...selection(state),
  }
}

const mapDispatchToProps = models => ({ bar: models.foo.bar })

export default connect(mapStateToProps, mapDispatchToProps)(MyComponent)
```


Selectors can also be called directly anywhere within your app.

```js
const store = init({ ... })

store.select.cart.expensiveFilter(50.00)(store.getState())
```



## External Selectors

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

`selectPlugin(config?: any)`

Create the plugin.

```js
init({
  plugins: [ selectPlugin(config) ]
})
```



#### config.selectorCreator:

`selectorCreator: (...deps, resultFunc) => any`

An option that allows the user to specify a different function to be used when creating selectors.

The default is `createSelector` from `reselect`. See [recipes](#Recipes) for other uses.



#### config.sliceState:

`sliceState: (rootState, model) => any`

An option that allows the user to specify how the state will be sliced in the `slice` function.
The function takes the `rootState` as the first parameter and the `model` corresponding to the selector as the
second parameter. It should return the desired state slice required by the selector.

The default is to return the slice of the state that corresponds to the owning model's name, but this assumes the store is a Javascript object.

Most of the time the default should be used, however, there are some cases where one may want to specify the `sliceState` function. See [the immutable.js recipe for an example.](#immutablejs)



### store.select:

`select( mapSelectToStructure: (select) => object)`

Using `select` as a function lets you bind your view as a selector itself - preventing un-needed re-renders.

Creates a [structuredSelector](https://github.com/reduxjs/reselect#createstructuredselectorinputselectors-selectorcreator--createselector) using the selectors you return in `mapSelectToStructure`.


`select: { [modelName]: { [selectorName]: (state) => any } }`

`select` also contains all of the selectors from your store models. Selectors can be called anywhere and do not have to be called inside another selector.



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
