import React from 'react'
import ReactDOM from 'react-dom'
import { connect, Provider } from 'react-redux'
import { model, init, getStore, pluginExports } from 'rematch-x'

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
      pluginExports.dispatch.countA.increment()
    }
  },
  selectors: {
    double: s => s * 2
  },
  hooks: {
    'countB/increment': () => {
      pluginExports.dispatch.countA.increment()
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
    <div>countA is {valueA} <em>(plain 'ol state)</em></div>
    <div>countB is {valueB} <em>(plain 'ol state)</em></div>
    <div>countA doubled is {valueADoubled} <em>(a selector!)</em></div>
    <div>
      <button onClick={incrA}>Increment countA</button>
      {' '}
      <em>(a normal dispatch!)</em>
    </div>
    <div>
      <button onClick={asyncAIncr}>Increment countA (delayed 1 second)</button>
      {' '}
      <em>(an async effect!!!)</em>
    </div>
    <div>
      <button onClick={incrB}>Increment countB</button>
      {' '}
      <em>(a normal dispatch on countB... And there is a 'countB/increment' hook on countA model,
        which dispatches 'countA/increment', so this increments countA too!!! </em>
    </div>
  </div>
)

// Use react-redux's connect
const AppContainer = connect(state => ({
  valueA: state.countA,
  valueB: state.countB,
  // valueADoubled : pluginExports.select.countA.double(state),
  incrA: () => pluginExports.dispatch.countA.increment(),
  asyncAIncr: () => pluginExports.dispatch.countA.asyncIncrement(),
  incrB: () => pluginExports.dispatch.countB.increment()
}))(App)

// Use react-redux's <Provider /> and pass it the store.
ReactDOM.render(
  <Provider store={getStore()}>
    <AppContainer />
  </Provider>,
  document.getElementById('root')
)
