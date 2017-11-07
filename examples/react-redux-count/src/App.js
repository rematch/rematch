import React from 'react'
import { connect } from 'react-redux'
import { dispatch, select } from '@rematch/core'

// Make a presentational component.
// It knows nothing about redux or rematch.
const App = ({ valueA, valueB, valueADoubled, asyncAIncr, incrB, incrA }) => (
  <div>
    <h2>countA is <b style={{backgroundColor: '#ccc'}}>{valueA}</b></h2>
    <h2>countB is <b style={{backgroundColor: '#ccc'}}>{valueB}</b></h2>

    <h2>
      <button onClick={incrA}>Increment countA</button>
      {' '}
      <em style={{backgroundColor: 'yellow'}}>(normal dispatch)</em>
    </h2>
    <h2>countA doubled is <b style={{backgroundColor: '#ccc'}}>{valueADoubled}</b> <em style={{backgroundColor: 'yellow'}}>(a selector!)</em></h2>
    <h2>
      <button onClick={asyncAIncr}>Increment countA (delayed 1 second)</button>
      {' '}
      <em style={{backgroundColor: 'yellow'}}>(an async effect!!!)</em>
    </h2>
    <h2>
      <button onClick={incrB}>Increment countB</button>
      {' '}
      <em style={{backgroundColor: 'yellow'}}>(countA has a hook listening to 'countB/increment')</em>
    </h2>
  </div>
)

// Use react-redux's connect
export default connect(state => ({
  valueA: state.countA,
  valueB: state.countB,
  valueADoubled: select.countA.double(state),
  incrA: dispatch.countA.increment,
  asyncAIncr: dispatch.countA.asyncIncrement,
  incrB: dispatch.countB.increment,
}))(App)
