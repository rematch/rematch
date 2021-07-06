---
id: select
title: Select
sidebar_label: "@rematch/select"
slug: /plugins/select/
---

import { MultiLangComponent } from "/src/components/MultiLangComponent"

A plugin to add memoized state selection to Rematch. Selectors are created using [Reselect](https://github.com/reduxjs/reselect) by default and are automatically wired with selector dependencies from other models.

## Compatibility

Install the correct version of select plugin based on the version of the core Rematch library in your project.

| @rematch/core | @rematch/select |
| :-----------: | :-------------: |
|     1.x.x     |      2.x.x      |
|     2.x.x     |       3.x       |

## Install

```bash npm2yarn
npm install @rematch/select
```

## selectPlugin([config])

The select plugin accepts one optional argument - **config**, which is an object with the following properties:

- [`sliceState`] (_(rootState, model) => modelState_): custom function for getting model's state based on the store's root state and the model object. The default function assumes your store is a plain JavaScript object. You might need to overwrite it in some cases, see the [plugin's recipes for an example](#immutablejs).

- [`selectorCreator`] (_(selector, combiner) => outputSelector_): you can replace Reselect library with a different one by providing a custom function for creating selectors that has the same interface as Reselect. See the [plugin's recipes for an example](#re-reselect).

## Usage

### 1. Add plugin

Start by adding the plugin to your store:

<MultiLangComponent>

```js title="store.js"
import { init } from "@rematch/core";
import selectPlugin from "@rematch/select";
import * as models from "./models";

init({
  models,
  // add selectPlugin to your store
  plugins: [selectPlugin()],
});
```

```ts title="store.ts"
import selectPlugin from "@rematch/select";
import { init, RematchDispatch, RematchRootState } from "@rematch/core";
import { models, RootModel } from "./models";

export const store = init<RootModel>({
  models,
  // add selectPlugin to your store
  plugins: [selectPlugin()],
})

export type Store = typeof store;
export type Dispatch = RematchDispatch<RootModel>;
export type RootState = RematchRootState<RootModel>;
```

</MultiLangComponent>

### 2. Add selectors

Now add selectors to your models. A **"selector"** is a function that given the current **root state** and **props** returns some value:

```js
(rootState, props) =>
  rootState.cart.reduce((total, item) => total + item.price * item.amount, 0);
```

To make our applications fast, we actually want to create **"memoized selectors"**, which means they recalculate only when the data they are based on changes. The selector plugin exposes some functions to make this process easy.

Selectors can be added to a model using the `selectors` property. It must be a function accepting the following arguments and returning selectors:

- `slice` - utility function that can be used in two different ways:
  - (_(modelState => value) => memoizedSelector_): it can accept as an argument a selector from current's model state. In this case it returns a memoized selector. It is basically a shortcut for creating simple memoized selectors.
  - (_(rootState) => modelState_): if given a root state as an argument, it returns current's model state.
- `createSelector` - function for creating memoized selectors. By default, it's Reselect's _createSelector_ function. Refer to [Reselect documentation](https://github.com/reduxjs/reselect#createselectorinputselectors--inputselectors-resultfunc) for details.
- `hasProps` - utility function which creates a new selector cache for each new set of `props`. It wraps an entire selector factory and creates a higher-order selector. [For complex calculations or dashboards a recipe may be better](#re-reselect).

There are three more details to keep in mind:

- Inside selectors, `this` is bound to the current model's selectors.
- Each selector accepts `models` argument which allows accessing selectors from other models.
- [Be careful when passing `props` to a selector because of how reselect caches results.](https://github.com/reduxjs/reselect/blob/master/README.md#sharing-selectors-with-props-across-multiple-component-instances)

### 3. Selector Examples

Let's look at the examples!

```js
const model = {
  name: "cart",
  state: [
    {
      price: 42.0,
      amount: 3,
      productId: 2,
    },
  ],
  selectors: (slice, createSelector, hasProps) => ({
    // creates a simple memoized selector based on the cart state
    total() {
      return slice((cart) => cart.reduce((a, b) => a + b.price * b.amount, 0));
    },
    // uses createSelector method to create more complex memoized selector
    totalWithShipping() {
      return createSelector(
        slice, // shortcut for (rootState) => rootState.cart
        (rootState, props) => props.shipping,
        (cart, shipping) =>
          cart.reduce((a, b) => a + b.price * b.amount, shipping)
      );
    },
    // refers to the other selector from this model
    doubleTotal() {
      return createSelector(
        this.totalWithShipping,
        (totalWithShipping) => totalWithShipping * 2
      );
    },
    // accesses selector from a different model
    productsPopularity(models) {
      return createSelector(
        slice, // shortcut for (rootState) => rootState.cart
        models.popularity.pastDay, // gets 'pastDay' selector from 'popularity' model
        (cart, hot) => cart.sort((a, b) => hot[a.productId] > hot[b.productId])
      );
    },
    // uses hasProps function, which returns new selector for each given lowerLimit prop
    expensiveFilter: hasProps(function (models, lowerLimit) {
      return slice((items) => items.filter((item) => item.price > lowerLimit));
    }),
    // uses expensiveFilter selector to create a new selector where lowerLimit is set to 20.00
    wouldGetFreeShipping() {
      return this.expensiveFilter(20.0);
    },
  }),
};
```

### 4. Using Selectors In Your App

`@rematch/select` adds a `select` property to the store. It can be used in two ways:

- `select( mapSelectToStructure: (select) => object)`

When called as a function, `select` lazily creates a [structuredSelector](https://github.com/reduxjs/reselect#createstructuredselectorinputselectors-selectorcreator--createselector) using the selectors you return in `mapSelectToStructure`.

```js
const selection = store.select((models) => ({
  total: models.cart.total,
  eligibleItems: models.cart.wouldGetFreeShipping,
}));

// it can be used as 'mapStateToProps'
connect(selection)(MyComponent);
// or
connect((state) => ({
  contacts: state.contacts.collection,
  ...selection(state),
}))(MyComponent);
```

- `select: { [modelName]: { [selectorName]: (state) => any } }`

`select` is also an object with a group of selectors for each of your store models. Selectors are regular functions that can be called anywhere within your application.

```js
const moreThan50 = store.select.cart.expensiveFilter(50.0);

console.log(moreThan50(store.getState()));

const mapStateToProps = (state) => ({
  items: moreThan50(state),
});
```

## Recipes

### Immutable.js

If you are using an [Immutable.js](https://facebook.github.io/immutable-js/) Map as your store, you will need to configure the plugin to slice the state using [Map.get\(\)](http://facebook.github.io/immutable-js/docs/#/Map/get):

```js
selectorsPlugin({
  sliceState: (rootState, model) => rootState.get(model.name),
});
```

Now you can use an [Immutable.js Map](http://facebook.github.io/immutable-js/docs/#/Map) as your store and access the appropriate slice of the state in each of your selectors.

### Re-reselect

When working on a dashboard or doing calculations with a lot of external values, you may find your selectors always re-run. This happens when your selector has props and then is shared between multiple components.

Selectors have a cache size of 1. Passing a different set of props will invalidate the cache. [re-reselect exists to solve this by caching your selectors by props as well](https://github.com/toomuchdesign/re-reselect).

You can configure the plugin to use re-reselect:

```js
import createCachedSelector from "re-reselect";

selectorPlugin({
  selectorCreator: createCachedSelector,
});
```

### Alternative to selecting

The reason we use selectors is because they are lazy. The biggest drawback is that they have to rely on other models' public lazy interfaces - `slice` will only ever access the current model.

The actions fired by our store are another public interface that can eagerly track the changes to other models. Using a listener reducer might fit some applications better:

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
