# Rematch React

Better README coming soon... For now here's the example:

```jsx
import React from 'react'
import { render } from 'react-dom'
import Rematch from '@rematch/core'
import { useReact, connect, RematchReact } from '@rematch/react'

useReact(Rematch)

Rematch.init({
  models: {
    user: {
      name: 'user',
      state: { name: 'Blair', location: 'Vancouver' }
    },
    count: {
      name: 'count',
      state: 0,
      reducers: { up: state => state + 1 },
      selectors: { double: state => state * 2 }
    },
  }
})

const Component = ({user, count}) => (
  <ul>
    <li>Welcome, {user.state.name} from {user.state.location}</li>
    <li>The count is {count.state}</li>
    <li>The count doubled is {count.select.double()}</li>
    <li><button onClick={() => count.dispatch.up()}>count Up</button></li>
  </ul>
)

const Container = connect(['user', 'count'], ({user, count}) => ({
  user,
  count,
}))(Component)

render(
  <RematchReact>
    <Container />
  </RematchReact>,
  document.getElementById('root')
)
```