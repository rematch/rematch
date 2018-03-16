# Init Redux API Reference

> This section is likely not helpful for you unless you are building your own plugin or adding middleware. For a list of common init options, see the [@rematch/core API](./api.md)

- init
  - [redux](#redux)
    - [initialState](#initialstate)
    - [reducers](#reducers)
    - [middlewares](#middlewares)
    - [enhancers](#enhancers)
    - [rootReducers](#rootreducers)
    - [combineReducers](#combinereducers)
    - [createStore](#createstore)
    - [devtoolOptions](#devtooloptions)


## Redux

This section provides access to your Redux setup, along with options to overwrite Redux methods.

### initialState

```js
init({
  redux: {
    initialState: any
  }
 })
```

The initialState of your app. This is likely not necessary, as the state of your models will overwrite the initial state.

### reducers

```js
const someReducer = (state, action) => {
  switch(action.type) {
    default:
      return state
  }
}

init({
  redux: {
    reducers: {
      someReducer,
    }
  }
})
```

Allows passing in of reducer functions, rather than models. While not recommended, this can be used for migrating a Redux codebase or configuring different Redux extensions.

### middlewares

```js
init({
  redux: {
    middlewares: [customMiddleware()]
  }
})
```

Add middleware to your store.

### enhancers

```js
init({
  redux: {
    enhancers: [customEnhancer()]
  }
})
```

Add enhancers to your store.

### rootReducers

```js
init({
  redux: {
    rootReducers: {
      'RESET': (state, action) => undefined,
    }
  }
})
```

A way to setup middleware hooks at the base of your root reducer. Unlike middleware, the return value is the next state. If `undefined`, the state will fallback to the initial state of reducers.

### combineReducers

```js
init({
  redux: {
    combineReducers: customCombineReducers
  }
})
```

Allows access to overwrite Redux's `combineReducers` method. Currently necessary for setting up Redux persist v5.


### createStore

```js
init({
  redux: {
    createStore: customCreateStore
  }
})
```

Allows access to overwrite Redux's `createStore` method. Currently necessary for setting up Reactotron with Redux.

### devtoolOptions

```js
init({
  redux: {
    devtoolOptions: customDevtoolOptions
  }
})
```

Provides access to [redux devtool options](https://github.com/zalmoxisus/redux-devtools-extension/blob/master/docs/API/Arguments.md). Read more about configuring devtools under [devtool recipes](./recipes/devtools).
