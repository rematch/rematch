# React

从普通的 Redux 和 React 迁移到 Rematch 是非常简单的，实际上不需要对任何组件做必要的更改

无论如何， 你都可以选择简化 `connect` ，查看下面的例子。

```javascript
import React from 'react'
import { connect } from 'react-redux'

const Counter = props => (
	<div>
		<h2>Count: {props.count}</h2>
		<button onClick={props.increment} />
	</div>
)

const mapState = (state, ownProps) => ({
	count: state.count,
})

const mapDispatch = dispatch => ({
	increment: () => dispatch.count.increment(),
})
// You can also use destructuring
const mapDispatchWithDestructure = ({ count: { increment } }) => ({ increment })

export default connect(
	mapState,
	mapDispatch
)(Counter)
```

请注意，建议您将您的 `dispatch`语句保留在 mapDispatch 中。 这使您的组件保持纯粹，易于测试。

使用 `store` 来设置你的 React-Redux Provider。

```javascript
import React from 'react'
import { Provider } from 'react-redux'
import { init } from '@rematch/core'
import App from './App'

const store = init()

export default () => (
	<Provider store={store}>
		<App />
	</Provider>
)
```
