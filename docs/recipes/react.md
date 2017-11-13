# React

Moving from plain old Redux with React to Rematch is easy. It really involves no necessary changes with your components.

However, you may choose to simplify your `connect` statements. See an example below:

```js
import React from 'react'
import { connect } from 'react-redux'
import { dispatch } from '@rematch/core'

const Counter = (props) => (
  <div>
    <h2>Count: {props.count}</h2>
    <button onClick={props.increment} />
  </div>
)

const mapToProps = (state, ownProps) => ({
  count: state.count,
  increment: () => dispatch.count.increment(),
})

export default connect(mapToProps)(Counter)
```

There is no longer a need for using `mapDispatchToProps` when using `connect`, as `mapStateToProps` can be hijacked to handle everything you need. 

Also note that it's recommended you keep your `dispatch` statements outside components. This keeps your components pure for testing. 
