# Rematch Loading

Adds automated loading indicators for effects to [Rematch](https://github.com/rematch/rematch). Inspired by [dva-loading](https://github.com/dvajs/dva-loading).

## Install

```shell
npm install @rematch/loading
```

> For @rematch/core@0.x use @rematch/loading@0.5.0

## Example

See an example below using a loading indicator within a button.

```js
import React from 'react'
import { connect } from 'react-redux'
import AwesomeLoadingButton from './components/KindaCoolLoadingButton'

const LoginButton = (props) => (
  <AwesomeLoadingButton onClick={props.submit} loading={props.loading}>
    Login
  </AwesomeLoadingButton>
)

const mapState = (state) => ({
  loading: state.loading.effects.login.submit, // true when the `login/submit` effect is running
  // or
  loading: state.loading.models.login, // true when ANY effect on the `login` model is running
})

const mapDispatch = (dispatch) => ({
  submit: () => dispatch.login.submit()
})

export default connect(mapState, mapDispatch)(LoginButton)
```

## Demo

See a [demo](https://github.com/rematch/rematch/tree/master/plugins/loading/examples/react-loading-example)

![rematch-loading](https://user-images.githubusercontent.com/4660659/33303781-00c786b2-d3ba-11e7-8216-1b2b8eebbf85.gif)

## Setup

Configure loading.

```js
import { init } from '@rematch/core'
import createLoadingPlugin from '@rematch/loading'

// see options API below
const options = {}

const loading = createLoadingPlugin(options)

init({
  plugins: [loading]
})
```

## Options

### asNumber

```js
{ asNumber: true }
```

The loading state values are a "counter", returns a number (eg. `store.getState().loading.global === 5`).

Defaults to `false`, returns a boolean (eg. `store.getState().loading.global === true`)

### name

```js
{ name: 'load' }
```

In which case, loading can be accessed from `state.load.global`.

Defaults to the name of `loading` (eg. `state.loading.global`).

### whitelist

A shortlist of actions. Named with "modelName" / "actionName".

```js
{ whitelist: ['count/addOne'] })
```


### blacklist

A shortlist of actions to exclude from loading indicators.

```js
{ blacklist: ['count/addOne'] })
```

### model

`{ model: {...} }`

A [model](https://github.com/rematch/rematch/blob/master/docs/api.md#model) configuration object which is included
in the loading model. The user can add a custom `name`, `reducers` and `state` config along with `selectors` and
other valid configs provided by other plugins.

One advantage of this config is that it provides the ability to take advantage of the
[@rematch/select](https://github.com/rematch/rematch/blob/master/plugins/select/README.md)
plugin and add custom `selectors` to your loading model.  For example:

```js
import createLoadingPlugin from '@rematch/loading'

// @rematch/selector plugin API
const options = {
  model: {
    selectors: {
      loggingIn(state) { return state.effects.login.submit }
    }
  }
}

const loading = createLoadingPlugin(options)
```

A few notes on the model configuration option:

- The `name` config will take precedence and override the `model.name` config.
- The effects config (`model.effects`) has not been tested.
- The reducers config (`model.reducers`) has been tested and can be used to add addition reducers.
Although, the une case for this config is unclear. Any `show` and `hide`
reducers will be overriden by the plugin.
- Unless you know what you are doing, it is not recommended to provide a `model.state` config. Providing the wrong
config can break the plugin in unexpected ways.

### mergeInitialState

`{ mergeInitialState: (state, newObject ) => any }`

A function that **mutates** the initial state of the loading model by merging it with the provided object.  It accepts
the current `state` as the first parameter and the `newObject` to be merged as the second parameter. It is important
that this function mutate the provided `state` and not return a new state.

Ordinarily, the user should not set this config.  However, this config is required if the user is not using a JavaScript
Object as the store.  It will be needed when using Immutable JS for example.

### loadingActionCreator

`{ loadingActionCreator: (state, name, action, converter, countState) => any }`

A reducer function that returns the new state when a loading effect is dispatched.  It accepts the current `state`,
the `name` (string) of the model that was dispatched, the `action` (string) that was dispatched, a `converter` function
and the current `countState` object.

This is a complex function and it is best to accept the default. If you want to customize this function, look at the
loading plugin source code to gain an idea of how this function should work. This config is exposed so a user can make
use of a store that is not a JavaScript object (Immutable JS for example).

## Immutable JS Example

The user may use an [Immutable.js](https://facebook.github.io/immutable-js/) Map with this plug in.
To do so, the `mergeInitialState`, `loadingActionCreator` and `model.state` configs will need to be set.
Here is a minimal example:

```js
import createLoadingPlugin from '@rematch/loading'
import { fromJS } from 'immutable';

// Immutably returns the new state
const immutableLoadingActionCreator = (state, name, action, converter, cntState) => (
  state.asImmutable().withMutations( map => map.set('global', converter(cntState.global))
    .setIn(['models', name], converter(cntState.models[name]))
    .setIn(['effects',name, action], converter(cntState.effects[name][action]))
  )
)

// Mutates the current state with a deep merge
const immutableMergeInitialState = (state, newObj) => (
  state.asMutable().mergeDeep(fromJS(newObj))
)

const options = {
  loadingActionCreator: immutableLoadingActionCreator,
  mergeInitialState: immutableMergeInitialState,
  model: {
    state: fromJS({}),
  }
}

const loading = createLoadingPlugin(options);
```

The above example has been tested and is included in the test suite of this package.


