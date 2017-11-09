import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { init, getStore } from '@rematch/core'
import App from './App'
import * as models from './models'

init({
  models,
})

// Use react-redux's <Provider /> and pass it the store.
ReactDOM.render(
  <Provider store={getStore()}>
    <App />
  </Provider>,
  document.getElementById('root')
)
