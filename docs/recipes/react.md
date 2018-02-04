# React

Moving from plain old Redux with React to Rematch is easy. It really involves no necessary changes with your components.

However, you may choose to simplify your `connect` statements. See an example below:

```js
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

export default connect(mapState, mapDispatch)(Counter)
```

Note that it's recommended you keep your `dispatch` statements within mapDispatch. This keeps your components pure for testing. 

---

Use `store` to setup your React-Redux Provider.

```js
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
