---
id: redux
title: Redux
sidebar_label: Redux
slug: /api-reference/redux
---

It is possible to customize Redux configuration provided by Rematch. To do that, provide your own configuration to the Rematch [init](/docs/api-reference#initconfig) method as `config.redux` property.

:::caution
This section is likely not helpful for you unless you are migrating from plain Redux, building your own plugin or adding middleware.
:::

:::note
If you just need to include a redux library in your store, see the recipe for [redux plugins](/docs/recipes/redux-plugins).
:::

---

### Configuration

Configuration for Redux can be build using the following properties:

- [`initialState`] (_any_): the initialState of your app. This is likely not necessary, as the state of your models will overwrite the initial state.

- [`reducers`] (_{ [string]: (state, payload) => any }_): allows passing in reducer functions which are not part of a model. While not recommended, this can be used for migrating a Redux codebase or configuring different Redux extensions.

- [`enhancers`] (_Redux.StoreEnhancer_): add enhancers to your store.

- [`middlewares`] (_Redux.Middleware_): add middleware to your store.

- [`rootReducers`] (_{ [string]: (state, payload) => any }_): a way to setup middleware hooks at the base of your root reducer. Unlike middleware, the return value is the next state. If `undefined`, the state will fallback to the initial state of reducers.

- [`combineReducers`] (_reducers => reducer_): allows to overwrite Redux's `combineReducers` method.

- [`createStore`] (_Redux.StoreCreator_): allows to overwrite Redux's `createStore` method.

- [`devtoolOptions`] (_Redux.DevtoolOptions_): provides access to [React Devtools](https://github.com/facebook/react/tree/master/packages/react-devtools) options.

**Example**:

```js
import { init } from "@rematch/core";

const store = init({
  redux: {
    initialState: { example: 12 },
    reducers: {
      someReducer(state, action) {
        switch (action.type) {
          default:
            return state;
        }
      },
    },
    enhancers: [customEnhancer()],
    middlewares: [customMiddleware()],
    rootReducers: {
      RESET: (state, action) => {},
    },
    combineReducers: customCombineReducers,
    createStore: customCreateStore,
    devtoolOptions: customDevtoolOptions,
  },
});
```
