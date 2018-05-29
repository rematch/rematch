# Example using rematch with react and react-redux

#### To run
From the rematch directory...
```
npm install
npm run build
cd examples/react-redux-count/
npm install
npm start
```
Then go to http://localhost:3000

#### The example
```jsx
import React from 'react'
import ReactDOM from 'react-dom'
import { connect, Provider } from 'react-redux'
import { init } from '@rematch/core'

const count = {
 state: 0,
  reducers: {
    increment: s => s + 1
  },
  effects: {
    async asyncIncrement() {
      await new Promise((resolve) => {
        setTimeout(resolve, 1000)
      })
      this.increment()
    }
  },
}

// No need to specify a 'view' in init.
const store = init({
  models: { count }
})

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

const mapState = state => ({
  count: state.count,
})

const mapDispatch = dispatch => ({
  increment: dispatch.count.increment,
  asyncIncrement: dispatch.count.asyncIncrement,
})


// Use react-redux's <Provider /> and pass it the store.
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
```
