import React from 'react'
import { connect } from 'react-redux'
import { dispatch } from '@rematch/core'

// Make a presentational component.
// It knows nothing about redux or rematch.
const App = ({ count, asyncIncrement, increment }) => (
  <div>
    <h2>count is <b style={{ backgroundColor: '#ccc' }}>{count}</b></h2>
    
    <h2>
      <button onClick={increment}>Increment count</button>
    {' '}
    <em style={{ backgroundColor: 'yellow' }}>(normal dispatch)</em>
    </h2>

    <h2>
    <button onClick={asyncIncrement}>Increment count (delayed 1 second)</button>
    {' '}
    <em style={{ backgroundColor: 'yellow' }}>(an async effect!!!)</em>
    </h2>
  </div>
)

// Use react-redux's connect
export default connect(state => ({
  count: state.count,
  increment: dispatch.count.increment,
  asyncIncrement: dispatch.count.asyncIncrement,
}))(App)
