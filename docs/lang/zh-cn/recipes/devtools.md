# Devtools

## Redux-Devtools

Rematch 开箱即用 [Redux Devtools](https://github.com/zalmoxisus/redux-devtools-extension)。不需要配置。

```javascript
init() // devtools up and running
```

还可以添加 redux devtools [配置选项](https://github.com/zalmoxisus/redux-devtools-extension/blob/master/docs/API/Arguments.md)。

```javascript
init({
	redux: {
		devtoolOptions: options,
	},
})
```

要禁用 redux devtools, 设置 `disabled` 为 `true`。

```javascript
init({
	redux: {
		devtoolOptions: {
			disabled: true,
		},
	},
})
```

## Remote-Redux-Devtools

Remote-redux-devtools 不支持 rematch 查看此 [issue](https://github.com/rematch/rematch/issues/419).
你可以使用 [react-native-debugger](https://github.com/jhen0409/react-native-debugger) 在 rematch 也是开箱即用的.

## Reactotron

还可以设置 Rematch 与 [Reactotron devtools](https://github.com/infinitered/reactotron) 一起工作。

```javascript
// Reactotron.config.js
import Reactotron from 'reactotron-react-native'
import { reactotronRedux } from 'reactotron-redux'

export default Reactotron.configure({
	name: 'MyAwesomeApp',
})
	.use(reactotronRedux())
	// add other devtools here
	.connect()
```

覆写`createStore`来完成配置。

```javascript
// index.js
import Reactotron from './Reactotron.config.js'

init({
	redux: {
		enhancers: [Reactotron.createEnhancer()],
		// If using typescript/flow, enhancers: [Reactotron.createEnhancer!()]
	},
})
```
