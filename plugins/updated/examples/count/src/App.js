import React from 'react'
import moment from 'moment'
import { connect } from 'react-redux'
import { dispatch } from '@rematch/core'

const App = ({ count, asyncIncrement, lastUpdated }) => (
  <div>
    <h2>count is <b style={{ backgroundColor: '#ccc' }}>{count}</b></h2>
    
    <h2>
    <button onClick={asyncIncrement}>Increment count (delayed 1 second)</button>
    {' '}
    <em style={{ backgroundColor: 'yellow' }}>(an async effect!!!)</em>
    </h2>

    <p>{lastUpdated && moment(lastUpdated).format('LLLL')}</p>
  </div>
)

export default connect(state => ({
  count: state.count,
  asyncIncrement: dispatch.count.asyncIncrement,
  lastUpdated: state.updated.count.asyncIncrement,
}))(App)
