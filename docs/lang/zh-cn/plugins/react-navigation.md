# React Navigation

React-Navigation

## 安装

```text
npm install react-navigation @rematch/react-navigation
```

?>  `@rematch/core@0.x` 请使用 `@rematch/react-navigation@1.1.0`

### 示例

[一个例子](https://github.com/rematch/rematch/tree/e4fe17537a947bbe8a9faf1e0e77099beb7fef91/plugins/react-navigation/examples/demo/README.md)

## 设置

使用 Redux 设置 React-Navigation 是一个多步骤过程。 希望这个插件简化了这个过程。

1. 创建你的`<Routes />`，然后选择你的 `initialRouteName` 的名称。

```javascript
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

2.  传递 `Routes` 和 `initialRouteName` 进入 `createReactNavigationPlugin`

```javascript
// index.js
import { init, dispatch } from '@rematch/core'
import createReactNavigationPlugin from '@rematch/react-navigation'
import * as ReactNavigation from 'react-navigation'
import Routes from './Routes'

// add react navigation with redux
const { Navigator, reactNavigationPlugin } = createReactNavigationPlugin({
	Routes,
	initialScreen: 'Landing',
})

const store = init({
	plugins: [reactNavigationPlugin],
})

export default () => (
	<Provider store={store}>
		<Navigator />
	</Provider>
)
```

3. 使用包含 navigation helpers 的插件来简化派发 Navigation action。

```javascript
// included in plugin
dispatch.nav.navigate = action => dispatch(NavigationActions.navigate(action))
dispatch.nav.reset = action => dispatch(NavigationActions.reset(action))
dispatch.nav.back = action => dispatch(NavigationActions.back(action))
dispatch.nav.setParams = action => dispatch(NavigationActions.setParams(action))
```

4. 只需传递 `NavigationAction` 选项即可。

```javascript
// somewhere in your app
import { dispatch } from '@rematch/core'

dispatch.nav.navigate({ routeName: 'Login' })
```

如有必要，导入`NavigationActions`。

```javascript
import { dispatch } from '@rematch/core'
import { NavigationActions } from 'react-navigation'

const resetAction = dispatch.navigate.reset({
	index: 1,
	actions: [
		NavigationActions.navigate({ routeName: 'Profile' }),
		NavigationActions.navigate({ routeName: 'Settings' }),
	],
})
```

### Back Handler

使用 react-navigation 设置 Android 后退按钮处理的示例。

```javascript
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
		)
	}
}
```

### Selectors

你可能会发现将一些自定义 selector 添加到你的`nav model`是有帮助的。您可以通过创建一个`nav model`配置对象来轻松添加 selector。这个例子将添加一个`currentRouteName`选择器：

```javascript
// models/nav.js
export default {
	selectors: {
		currentRouteName(state) {
			return state.routes[state.index].routeName
		},
	},
}
```

将上面的 model 添加到您的 Rematch 配置中：

```javascript
// models/index.js
export { default as nav } from './nav'
```

确保您的新 model 包含在您的`init`中：

```javascript
import { select } from '@rematch/select'
import * as models from './models'

const store = init({
	models,
	plugins: [select, reactNavigationPlugin],
})
```

当然，你还需要安装 [Rematch Select 插件](https://github.com/rematch/rematch/blob/master/plugins/select/README.md)。

现在你将有能力在你的 app 内调用`select.nav.currentRouteName(state)`，参阅 [Rematch Select 插件文档](https://github.com/rematch/rematch/blob/master/plugins/select/README.md) 以获取更多关于配置和使用的 selector。

### Immutable JS and other non-{ } Stores

如果您的 store 不是标准的 Javascript 对象`{}`，那么您可能需要将 `sliceState` 配置传递给`createReactNavigationPlugin`。该函数获取状态并返回包含 React Navigation 对象的状态片段。它在`Navigator`中用于将 state 映射到其属性，并用于侦听 navigation state 更改的中间件。默认情况下使用`state.nav`，在大多数情况下它可以正常工作。

如果你的 store 是一个 [Immutable JS](https://facebook.github.io/immutable-js/) 对象，你可能需要传递 `sliceState: state => state.get('nav')` 作为 `createReactNavigationPlugin` 的配置。这里有一个小例子：

```javascript
// index.js
import { init, dispatch } from '@rematch/core'
import createReactNavigationPlugin from '@rematch/react-navigation'
import * as ReactNavigation from 'react-navigation'
import Routes from './Routes'
import { combineReducers } from 'redux-immutable'
import { Map } from 'immutable'

// add react navigation with redux
const { Navigator, reactNavigationPlugin } = createReactNavigationPlugin({
	Routes,
	initialScreen: 'Landing',
	sliceState: state => state.get('nav'), // Returns Immutable JS slice
})

const store = init({
	initialState: fromJS({}),
	plugins: [reactNavigationPlugin],
	redux: {
		initialState: Map(), // Initializes a blank Immutable JS Map
		combineReducers: combineReducers, // Combines reducers into Immutable JS collection
	},
})

export default () => (
	<Provider store={store}>
		<Navigator />
	</Provider>
)
```

在上面的例子中，你的 store 是一个 Immutable JS 对象。但是，商店的`nav`切片是标准的 JS 对象。我推荐这种方法，因为 React Navigation 导航器和 Redux 中间件期望导航状态是一个标准的 JS 对象。这是最高效的方法。另一种方法是将导航状态存储为不可变 JS 映射，每次导航器或中间件需要访问 Rematch 状态时都需要调用 `fromJS()` 和 `toJS()`，这会导致性能下降。
