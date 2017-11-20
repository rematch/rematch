# Init Advanced API Reference

> This section is likely not helpful for you unless you are building your own plugin or adapting new middleware. For a list of common init options, see the [API reference](./api.md)

- init
  - [extraReducers](#extrareducers)
  - [overwrites](#overwrites)
    - [combineReducers](#combinereducers)
    - [createStore](#createstore)
  - [devtoolOptions](#devtooloptions)


### extraReducers

```js
init({
  extraReducers: {
    nav: navReducer,
  }
})
```

Allows passing in of reducer functions, rather than models. While not recommended, this can be used for migrating a Redux codebase or configuring different Redux extensions.

### overwrites

Provides access for overwriting Redux core.

#### combineReducers

```js
init({
  overwrites: {
    combineReducers: customCombineReducers
  }
})
```

Allows access to overwrite Redux's `combineReducers` method. Currently necessary for setting up Redux persist v5.


#### createStore

```js
init({
  overwrites: {
    createStore: customCreateStore
  }
})
```

Allows access to overwrite Redux's `createStore` method. Currently necessary for setting up Reactotron with Redux.

### devtoolOptions

Provides access to [redux devtool options]((https://github.com/zalmoxisus/redux-devtools-extension/blob/master/docs/API/Arguments.md)) Read more about configuring devtools under [devtool recipes](./recipes/devtools).