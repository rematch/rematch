# React Navigation Plugin

React-Navigation

## Installation

```
npm install react-navigation @rematch/react-navigation
```

## Setup

Setting up React-Navigation with Redux is a multistep process. Hopefully this plugin simplifies the process.

1. Create your `<Routes />`, and select the name of your `initialRouteName`.

```js
// Routes.js
export default StackNavigator(
  {
    Landing: {
      screen: Screen.Landing,
    },
    Login: {
      screen: Screen.Login,
    },
    App: {
      screen: App,
    },
  },
  {
    initialRouteName: 'Landing',
  }
)

```

2. Pass `reactNavigation` itself, `Routes` and `initialRouteName` into `createReactNavigation`. 

Note: unfortunately this package has build issues when referencing `react-navigation` directly, so "react-navigation" must be passed in.

```js
// index.js
import { init, getStore } from '@rematch/core'
import createReactNavigation from '@rematch/react-navigation'
import * as ReactNavigation from 'react-navigation'
import Routes from './Routes'

// add react navigation with redux
const { Navigator, reactNavigationPlugin } = createReactNavigation(ReactNavigation, Routes, 'Landing')

init({
  plugins: [reactNavigationPlugin],
})

export default () => (
  <Provider store={getStore()}>
    <Navigator />
  </Provider>
)
```

3. Use the plugins included navigation helpers to simplify dispatching Navigation actions.

```js
// included in plugin
dispatch.nav.navigate = (action) => dispatch(NavigationActions.navigate(action))
dispatch.nav.reset = (action) => dispatch(NavigationActions.reset(action))
dispatch.nav.back = (action) => dispatch(NavigationActions.back(action))
dispatch.nav.setParams = (action) => dispatch(NavigationActions.setParams(action))
```

Just pass the NavigationAction options.

```js
// somewhere in your app
import { dispatch } from '@rematch/core'

dispatch.nav.navigate({ routeName: 'Login' })
```

If necessary, import `NavigationActions`.

```js
import { dispatch } from '@rematch/core'
import { NavigationActions } from 'react-navigation'

const resetAction = dispatch.navigate.reset({
  index: 1,
  actions: [
    NavigationActions.navigate({ routeName: 'Profile'}),
    NavigationActions.navigate({ routeName: 'Settings'})
  ]
})
```

4. Profit!
