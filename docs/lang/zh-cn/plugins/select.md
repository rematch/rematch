# Selectors

一个插件为 Rematch 提供增加缓存 state 选择。 选择器默认使用 [reselect](https://github.com/reduxjs/reselect) 并且与其他 model 自动连接.

> 这是 @rematch/select 2.0 的文档. 其他版本的文档 [历史文档](https://github.com/rematch/rematch/blob/f59cfeebaf1d3022b308e32d3a3f24440906478c/plugins/select/README.md)

- [开始](#getting-started)
- [生成选择器](#building-selectors)
- [API 文档](#api-docs)
- [指南](#recipes)

## 开始

### 安装

```text
npm install @rematch/select
```

### Setup

```javascript
import selectPlugin from '@rematch/select'
import { init } from '@rematch/core'

init({
	plugins: [selectPlugin()],
})
```

## Building Selectors

### Basics

A "selector" is just a function that uses the current state to derive a value:

```javascript
;(state, payload?) => any
```

You've probably already written one for a connected component's `mapStateToProps`

```javascript
const mapStateToProps = (state, props) => ({
	total: state.cart.items.reduce((a, b) => a + b.price * b.amount, 0),
})

connect(mapStateToProps)(MyComponent)
```

### Model Selectors

Store models can declare commonly used selectors that are accessible to the rest of your application.

Selectors can be added to a store model with a `selectors` config:

```diff
const model = {
  name: 'cart',
  state: [{
    price: 42.00,
    amount: 3,
  }],
+  selectors: { ... }
}
```

**To wire together models, `@rematch/select` requires factory functions to delay creating selectors until their dependencies are ready.** During the `createStore()` call, each factory will only be evaluated once.

Our basic selector from the last section is a good example of a computed value:

```javascript
const model = {
  ...
  selectors: {
    total() {
      return (rootState, props) =>
        rootState.cart.reduce((a, b) => a + (b.price * b.amount), 0)
    }
  }
}
```

The `mapStateToProps` function from the previous example is now easy to re-use; _but_ it will still be recomputed every time it gets called. To make this app perform better, we can use [redux's reselect ](https://github.com/reduxjs/reselect) api in our model :

```javascript
const model = {
  ...
  selectors: (slice, createSelector, hasProps) => ({ ... })
}
```

The first function - `slice` - re-runs a function only when the current model has actually updated. Our example model doesn't use any other models to compute the total - when any other models do update, its total will stay the same. By using `slice`, we can keep our app from repeating work by caching the result of total.

> Named selectors create a public interface for other models to use.

```javascript
total () {
  return slice(cart =>
    cart.reduce((a, b) => a + (b.price * b.amount), 0)
  )
}
```

Some models might need to use other selectors to derive their result. The `createSelector` function uses all of its arguments except the last one to _select_ values to watch for changes before calling its final argument with those selected values. By default, this function is just reselect's `createSelector`.

> `slice` can also be used as a dependency that returns the current model's slice of state.

```javascript
total () {
  return createSelector(
    slice,
    (state, props) => props.shipping,
    (cart, shipping) => cart.reduce((a, b) => a + (b.price * b.amount), shipping)
  )
}
```

### Combining selectors

Selector factories also get passed the store's `select` object. During the initial `createStore`, all store models are visited before building their selectors.

> Inside `selectors`, it can be less redundant to use the descriptive name `models`.

> If a factory is declared using `function`, `this` is bound to the current model's selectors.

```javascript
poorSortByHot (models) {
  return createSelector(
    this.rankableItems,
    models.popularity.pastDay,
    (cart, hot) => cart.sort((a, b) => hot[a.product] > hot[b.product])
  )
}
```

#### Alternatives to selecting

The reason we use selectors is because they are lazy. The biggest drawback is that they have to rely on other models' public lazy interfaces - `slice` will only ever access the current model.

The actions fired by our store are another public interface that can eagerly track the changes to other models. Using a listener reducer might fit some applications better:

```javascript
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

Previous examples have shown selectors with dependencies that can receive `props`:

```javascript
;(state, props) => props.shipping
```

[You need to be careful when passing `props` to a selector because of how reselect caches results. ](https://github.com/reduxjs/reselect/blob/master/README.md#sharing-selectors-with-props-across-multiple-component-instances)

If a selector uses `props`, the third function passed in a model's config -`hasProps` - creates a new selector cache for each new set of `props`.

`hasProps` wraps an entire selector factory and creates a higher-order selector. [For complex calculations or dashboards a recipe may be better](select.md#re-reselect)

```javascript
expensiveFilter: hasProps(function (models, lowerLimit) {
  return slice(items => items.filter(item => item.price > lowerLimit))
}),

wouldGetFreeShipping () {
  return this.expensiveFilter(20.00)
},
```

## Using Selectors in your app

`@rematch/select` adds a `select` property to the store.

When accessed like an object, all of our models' selectors are callable:

```javascript
const moreThan50 = store.select.cart.expensiveFilter(50.0)

console.log(moreThan50(store.getState()))

const mapStateToProps = state => ({
	items: moreThan50(state),
})
```

When called as a function, `select` uses a passed function to map the store's models as part of a new selector function.

> Under the hood, `select` lazily creates a [structuredSelector](https://github.com/reduxjs/reselect#createstructuredselectorinputselectors-selectorcreator--createselector).

```javascript
const selection = store.select(models => ({
	total: models.cart.total,
	eligibleItems: models.cart.wouldGetFreeShipping,
}))
```

This "selection" will run each mapped selector and return an object - which works great for component bindings, since `connect` expects `mapStateToProps` to return an object:

```javascript
export default connect(selection)(MyComponent)
```

_Note_, this "selection" is just another selector function and could be called any number of ways. For example, a component might need to "step around" the public interface:

```javascript
connect(state => ({
	contacts: state.contacts.collection,
	...selection(state),
}))(MyComponent)
```

## Other Selector Creators

`@rematch/select` supports using your own `selectorCreator` directly in a model.

> Changing `config.selectorCreator` store-wide can make testing easier.

```javascript
isHypeBeast (models) {
  return customCreateSelector(
    slice,
    state => this.sortByHot(state)[0],
    (state, hottest) => hottest.price > 100.00
  )
}
```

## API Docs

```javascript
import selectPlugin from '@rematch/select'
```

- [selectPlugin](select.md#selectplugin)
  - [selectorCreator](select.md#configselectorcreator)
  - [sliceState](select.md#configslicestate)
- [store.select](select.md#storeselect)

### selectPlugin

- `selectPlugin(config?: any)`

Create the plugin.

```javascript
init({
	plugins: [selectPlugin(config)],
})
```

#### config.selectorCreator:

- `selectorCreator: (...deps, resultFunc) => any`

This option allows the user to specify a different function to be used when creating selectors.

The default is `createSelector` from `reselect`. See [recipes](select.md#Recipes) for other uses.

#### config.sliceState:

- `sliceState: (rootState, model) => any`

This option allows the user to specify how the state will be sliced in the `slice` function. The function takes the `rootState` as the first parameter and the `model` corresponding to the selector as the second parameter. It should return the desired state slice required by the selector.

The default is to return the slice of the state that corresponds to the owning model's name, but this assumes the store is a Javascript object.

Most of the time the default should be used, however, there are some cases where one may want to specify the `sliceState` function. See [the immutable.js recipe for an example.](select.md#immutablejs)

### store.select:

- `select( mapSelectToStructure: (select) => object)`

When called as a function, `select` lazily creates a [structuredSelector](https://github.com/reduxjs/reselect#createstructuredselectorinputselectors-selectorcreator--createselector) using the selectors you return in `mapSelectToStructure`.

- `select: { [modelName]: { [selectorName]: (state) => any } }`

`select` is also an object with a group of selectors for each of your store models. Selectors are regular functions that can be called anywhere within your application.

## Recipes

### Re-reselect

When working on a dashboard or doing calculations with a lot of external values, you may find your selectors always re-run. This happens when your selector has props \(such as a `hasProps` factory\) and then is shared between multiple components.

Selectors have a cache size of 1. Passing a different set of props will invalidate the cache. [re-reselect exists to solve this by caching your selectors by props as well](https://github.com/toomuchdesign/re-reselect)

```javascript
import createCachedSelector from 're-reselect'

selectorPlugin({
	selectorCreator: createCachedSelector,
})
```

```javascript
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

If you are using an [Immutable.js](https://facebook.github.io/immutable-js/) Map as your store, you will need to slice the state using [Map.get\(\)](http://facebook.github.io/immutable-js/docs/#/Map/get):

```javascript
selectorsPlugin({
	sliceState: (rootState, model) => rootState.get(model.name),
})
```

Now you can use an [Immutable.js Map](http://facebook.github.io/immutable-js/docs/#/Map) as your store and access the appropriate slice of the state in each of your selectors.
