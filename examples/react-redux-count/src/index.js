import React from 'react'
import ReactDOM from 'react-dom'
import { connect, Provider } from 'react-redux'
import { model, init, dispatch, select, getStore } from 'rematch-x'

init()

model({
  name: 'countA',
  state: 0,
  reducers: {
    increment: s => s + 1
  },
  effects: {
    asyncIncrement: async (payload, getState) => {
      await new Promise((resolve) => {
        setTimeout(resolve, 1000)
      })
      dispatch.countA.increment()
    }
  },
  selectors: {
    double: s => s * 2
  },
  subscriptions: {
    'countB/increment': () => {
      dispatch.countA.increment()
    }
  }
})

model({
  name: 'countB',
  state: 0,
  reducers: {
    increment: s => s + 1
  },
})

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
const AppContainer = connect(state => ({
  valueA: state.countA,
  valueB: state.countB,
  valueADoubled : select.countA.double(),
  incrA: () => dispatch.countA.increment(),
  asyncAIncr: () => dispatch.countA.asyncIncrement(),
  incrB: () => dispatch.countB.increment()
}))(App)

// Use react-redux's <Provider /> and pass it the store.
ReactDOM.render(
  <Provider store={getStore()}>
    <AppContainer />
  </Provider>,
  document.getElementById('root')
)
