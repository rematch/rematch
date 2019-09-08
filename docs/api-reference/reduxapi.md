# Init Redux API

> This section is likely not helpful for you unless you are building your own plugin or adding middleware. For a list of common init options, see the [@rematch/core API](api.md)
>
> If you just need to include a redux library in your store, see the recipe for [redux plugins](https://github.com/rematch/rematch/tree/e4fe17537a947bbe8a9faf1e0e77099beb7fef91/docs/recipes/redux.md)

* init
  * [redux](reduxapi.md#redux)
    * [initialState](reduxapi.md#initialstate)
    * [reducers](reduxapi.md#reducers)
    * [middlewares](reduxapi.md#middlewares)
    * [enhancers](reduxapi.md#enhancers)
    * [rootReducers](reduxapi.md#rootreducers)
    * [combineReducers](reduxapi.md#combinereducers)
    * [createStore](reduxapi.md#createstore)
    * [devtoolOptions](reduxapi.md#devtooloptions)

## Redux

This section provides access to your Redux setup, along with options to overwrite Redux methods.

### initialState

```javascript
init({
  redux: {
    initialState: any
  }
 })
```

The initialState of your app. This is likely not necessary, as the state of your models will overwrite the initial state.

### reducers

```javascript
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

```javascript
init({
  redux: {
    middlewares: [customMiddleware()]
  }
})
```

Add middleware to your store.

### enhancers

```javascript
init({
  redux: {
    enhancers: [customEnhancer()]
  }
})
```

Add enhancers to your store.

### rootReducers

```javascript
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

```javascript
init({
  redux: {
    combineReducers: customCombineReducers
  }
})
```

Allows access to overwrite Redux's `combineReducers` method. Currently necessary for setting up Redux persist v5.

### createStore

```javascript
init({
  redux: {
    createStore: customCreateStore
  }
})
```

Allows access to overwrite Redux's `createStore` method. Currently necessary for setting up Reactotron with Redux.

### devtoolOptions

```javascript
init({
  redux: {
    devtoolOptions: customDevtoolOptions
  }
})
```

Provides access to [redux devtool options](https://github.com/zalmoxisus/redux-devtools-extension/blob/master/docs/API/Arguments.md). Read more about configuring devtools under [devtool recipes](https://github.com/rematch/rematch/tree/e4fe17537a947bbe8a9faf1e0e77099beb7fef91/docs/recipes/devtools/README.md).

