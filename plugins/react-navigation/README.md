# React Navigation Plugin

React-Navigation

## Installation

```
npm install react-navigation @rematch/react-navigation
```
> For @rematch/core@0.x use @rematch/react-navigation@1.1.0

## Example

See [an example](./examples/demo).

## Setup

Setting up React-Navigation with Redux is a multistep process. Hopefully this plugin simplifies the process.

1. Create your Navigator normally

```js
export default createStackNavigator(
	{
		Login: { screen: LoginScreen },
		Main: { screen: MainScreen },
		Profile: { screen: ProfileScreen },
	},
	{
		initialRouteName: 'Landing',
	}
)
```

2. Pass your navigator into `createReactNavigationPlugin`. 

```js
// index.js
import { init, dispatch } from '@rematch/core'
import createReactNavigationPlugin from '@rematch/react-navigation'
import { createStackNavigator } from 'react-navigation'
import Navigator from './Navigator'

// adds redux to your navigator
// and prepares the plugin
const { ConnectedNavigator, reactNavigationPlugin } = createReactNavigationPlugin({    
  Navigator
})

const store = init({
  plugins: [reactNavigationPlugin],
})

export default () => (
  <Provider store={store}>
    <ConnectedNavigator />
  </Provider>
)
```

3. The plugins acts as a store model at `nav` or the configured `storeKey` to dispatch `react-navigation` actions.

```js
const { dispatch } = store

dispatch.nav.navigate(payload)
dispatch.nav.back(payload)
dispatch.nav.setParams(payload)
dispatch.nav.reset(payload)
dispatch.nav.replace(payload)
dispatch.nav.push(payload)
dispatch.nav.pop(payload)
dispatch.nav.popToTop(payload)
```

Just pass the same payload you would to a NavigationAction.

```js
const { dispatch } = store

...

dispatch.nav.navigate({ routeName: 'Login' })
```

If you need to, you can import actions directly from `react-navigation`:
```js
import { dispatch } from '@rematch/core'
import { NavigationActions } from 'react-navigation'

const resetAction = dispatch.nav.reset({
  index: 1,
  actions: [
    NavigationActions.navigate({ routeName: 'Profile'}),
    NavigationActions.navigate({ routeName: 'Settings'})
  ]
})
```

## Back Handler

An example for setting up the Android back button handling with react-navigation. 

```js
import { dispatch, init } from '@rematch/core'
import createReactNavigation from '@rematch/react-navigation'
import React from 'react'
import { BackHandler } from 'react-native'
import { Provider } from 'react-redux'
import { Routes } from './Routes'

export class App extends React.Component {
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBack)
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBack)
  }
  
  handleBack = () => {
    if (store.getState().nav.index === 0) {
      BackHandler.exitApp()
    }
    dispatch.nav.back()
    return true
  }

  render() {
    return (
      <Provider store={store}>
        <Navigator />
      </Provider>
    );
  }
}
```

## Selectors
If you are using the [Rematch Select plugin](https://github.com/rematch/rematch/blob/master/plugins/select/README.md), the `nav` store model adds some frequently used shortcuts.

```js
selectors.nav.currentRouteName(state)
```


## Immutable JS and other non-{ } Stores

If your store is not a standard Javascript Object `{ }`, then you may need to pass a `sliceState` config to
`createReactNavigationPlugin`.  This function takes the state and returns the slice of the state that contains the
React Navigation object. It is used in the `Navigator` to map the state to its props and it is used in the
middleware that listens for changes to the navigation state.  The default is to use `state.nav` which will work fine
in most cases.

If your store is an [Immutable JS](https://facebook.github.io/immutable-js/) object
you may need to pass `sliceState: state => state.get('nav')` as a config
to `createReactNavigationPlugin`.  Here is a minimal example:

```js
// index.js
import { init, dispatch } from '@rematch/core'
import createReactNavigationPlugin from '@rematch/react-navigation'
import * as ReactNavigation from 'react-navigation'
import Navigator from './Navigator'
import { combineReducers } from 'redux-immutable';
import { Map } from 'immutable';

// add react navigation with redux
const { ConnectedNavigator, reactNavigationPlugin } = createReactNavigationPlugin({
  Navigator,
  sliceState: state => state.get('nav')  // Returns Immutable JS slice
})

const store = init({
  initialState: fromJS({}),
  plugins: [reactNavigationPlugin],
  redux: {
    initialState: Map(),              // Initializes a blank Immutable JS Map
    combineReducers: combineReducers, // Combines reducers into Immutable JS collection
  },
})

export default () => (
  <Provider store={store}>
    <ConnectedNavigator />
  </Provider>
)
```

In the above example, your store is an Immutable JS object. However, the `nav` slice of your store is a standard JS
object. I recommend this approach since the React Navigation navigators and Redux middleware expects the navigation state
to be a standard JS object. This is the most performant approach.  The alternative is to store the navigation state as
an Immutable JS Map, which would require calls `fromJS()` and `toJS()` every time the navigator or the middleware
needs to access the Rematch state, which would cause a degradation in performance.
