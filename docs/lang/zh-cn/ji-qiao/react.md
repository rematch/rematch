---
description: >-
  从普通的旧版Redux与React转换到Rematch很容易。它实际上不会涉及对组件进行必要的更改。但是，您可以选择简化connect语句。请参见下面的一个例子:
---

# React

```javascript
import React from 'react'
import { connect } from 'react-redux'

const Counter = (props) => (
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
const mapDispatchWithDestructure = ({count: {increment}}) => ({increment})

export default connect(mapState, mapDispatch)(Counter)
```

请注意，建议您将您的 `dispatch`语句保留在mapDispatch中。 这使您的组件保持纯粹，易于测试。

  使用`store来设置你的React-Redux Provider。`

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



